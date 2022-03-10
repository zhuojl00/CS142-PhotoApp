import React from "react";
import axios from "axios";

import SelectUser from "./SelectUser";
import Tag from "./Tag";

class TagPhotoContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      userOptions: [],
      dragging: false,
    };
  }

  componentDidMount() {
    axios
      .get("/user/list")
      .then((response) => {
        this.setState({ userOptions: response.data || [] });
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/photo/${this.props.photoId}/tags`)
      .then((response) => {
        this.setState({ tags: response.data || [] });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updatePos = (e) => {
    if (this.state.dragging === false) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.setState({
      endX: x,
      endY: y,
    });
  };

  handleMouseDown = (e) => {
    if (this.state.selectUser) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.setState({
      dragging: true,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    });
  };

  handleMouseUp = (e) => {
    if (!this.state.dragging) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.setState({
      endX: x,
      endY: y,
      selectUser: true,
      dragging: false,
    });
  };

  handleMakeTag = (user) => {
    const startX = Math.min(this.state.startX, this.state.endX);
    const startY = Math.min(this.state.startY, this.state.endY);
    const endX = Math.max(this.state.startX, this.state.endX);
    const endY = Math.max(this.state.startY, this.state.endY);
    const tagObj = {
      first_name: user.first_name,
      last_name: user.last_name,
      user_id: user._id,
      x: startX,
      y: startY,
      width: endX - startX,
      height: endY - startY,
    };

    axios
      .post(`/photo/${this.props.photoId}/tag/create`, { tag: tagObj })
      .then((res) => {
        this.setState((state) => ({ tags: res.data }));
      })
      .catch((err) => console.error(err));

    this.setState({ dragging: false, selectUser: false });
  };

  handleRemoveTag = (tag) => {
    axios
      .post(`/photo/${this.props.photoId}/tag/remove`, { tag: tag })
      .then((res) => {
        this.setState((state) => ({ tags: res.data }));
      })
      .catch((err) => console.error(err));
  };

  render() {
    return (
      <div
        style={{
          position: "relative",
        }}
      >
        {this.state.tags &&
          this.state.tags.map((tag) => (
            <Tag
              {...tag}
              id={tag._id}
              startX={this.state.startX}
              startY={this.state.startY}
              endX={this.state.endX}
              endY={this.state.endY}
              handleRemoveTag={this.handleRemoveTag}
              fromDB
            />
          ))}
        <div
          style={{
            width: 640,
            height: 480,
          }}
          draggable={false}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.updatePos}
          onMouseUp={this.handleMouseUp}
        >
          {(this.state.dragging || this.state.selectUser) && (
            <Tag
              startX={this.state.startX}
              startY={this.state.startY}
              endX={this.state.endX}
              endY={this.state.endY}
              beingCreated
            />
          )}
          <img
            key={this.props.photoId}
            draggable={false}
            src={this.props.src}
            style={{
              width: 640,
              height: 480,
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </div>
        {this.state.selectUser && (
          <SelectUser
            x={this.state.startX}
            y={this.state.startY}
            handleMakeTag={this.handleMakeTag}
            userOptions={this.state.userOptions}
          />
        )}
      </div>
    );
  }
}

export default TagPhotoContainer;
