import React from "react";
import axios from "axios";
import { Button } from "@material-ui/core";
import "./commentsCard.css";
class CommentsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: "",
    };

    this.onInputChange.bind(this);
    this.onSubmitComment.bind(this);
  }

  onInputChange = (e) => {
    this.setState({ commentText: e.target.value });
  };

  onSubmitComment = (comment) => {
    axios
      .post(`/commentsOfPhoto/${this.props.photoId}`, {
        comment: comment,
      })
      .then(() => {
        this.props.addComment(this.props.photoId, comment);
      })
      .catch((err) => console.error(err));
  };

  render() {
    return (
      <div>
        <label id="input" htmlFor={`inputBox-${this.props.photoId}`}>
          <input
            style={{height: '2.25em'}}
            type="text"
            placeholder="Add comment"
            id={`inputBox-${this.props.photoId}`}
            onChange={this.onInputChange}
          />
        </label>

        <Button 
        variant="contained"
        color="primary"
        label="Submit"
        type="submit"
        onClick={() => this.onSubmitComment(this.state.commentText)}>
          Submit
        </Button>
      </div>
    );
  }
}

export default CommentsCard;
