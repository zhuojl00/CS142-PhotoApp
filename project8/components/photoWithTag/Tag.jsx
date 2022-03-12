import React from "react";
import { withRouter } from "react-router";

class TagPhotoContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showName: false,
    };
  }

  handleHover = () => {
    if (this.props.beingCreated) {
      return;
    }
    this.setState({
      showName: true,
    });
  };

  handleClickName = () => {
    if (this.props.beingCreated) {
      return;
    }
    this.props.history.push(`/users/${this.props.user_id}`);
  };

  getPos = () => {
    if (this.props.fromDB) {
      this.x = this.props.x;
      this.y = this.props.y;
      this.width = this.props.width;
      this.height = this.props.height;
      return;
    }

    const startX = Math.min(this.props.startX, this.props.endX);
    const startY = Math.min(this.props.startY, this.props.endY);
    const endX = Math.max(this.props.startX, this.props.endX);
    const endY = Math.max(this.props.startY, this.props.endY);
    this.x = startX;
    this.y = startY;
    this.width = endX - startX;
    this.height = endY - startY;
  };
  render() {
    this.getPos();
    return (
      <div
        style={{
          position: "absolute",
          left: this.x,
          top: this.y,
          width: this.width,
          height: this.height,
          border: "3px solid blue",
        }}
        draggable={false}
        onMouseEnter={this.handleHover}
        onMouseLeave={() => this.setState({ showName: false })}
      >
        {this.props.fromDB && this.state.showName && (
          <div
            style={{ position: "relative", cursor: "pointer", zindex: 99999 }}
          >
            <div
              style={{
                position: "absolute",
                background: "white",
                right: 0,
                top: -15,
                width: 20,
                height: 20,
                textAlign: "center",
                border: "1px solid white",
                borderRadius: "10px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                this.props.handleRemoveTag({ _id: this.props.id });
              }}
            >
              x
            </div>
            <p
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                padding: "10px",
                background: "black",
                border: this.state.showName && "1px solid black",
                cursor: "pointer",
                color: "white",
              }}
              onClick={this.handleClickName}
            >
              {this.props.first_name}
              <br />
              {this.props.last_name}
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(TagPhotoContainer);
