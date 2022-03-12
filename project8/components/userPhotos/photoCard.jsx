import React from "react";
import axios from "axios";
import { Box, Button, CardActions, IconButton } from "@material-ui/core";
import { BsBookmark, BsBookmarkFill, BsHeart, BsHeartFill } from "react-icons/bs";

class PhotosCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addFavorites = () => {
    axios
      .post(`/addFavorites/${this.props.photoId}`, {})
      .then((response) => {
        this.props.updateCards();
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <Box>
        <CardActions disableSpacing>
          <IconButton
            placeholder="favorite"
            title="add to favorites"
            onClick={this.addFavorites}
          >
            {this.props.alreadyFavorites.includes(this.props.photoId) ? (
              <BsBookmarkFill style={{ background: "primary" }}/>
            ) : (
              <BsBookmark />
            )}
          </IconButton>
          <IconButton
            placeholder="like"
            title="like"
            onClick={this.addFavorites}
          >
            {this.props.alreadyFavorites.includes(this.props.photoId) ? (
              <BsHeartFill style={{ background: "primary" }}/>
            ) : (
              <BsHeart />
            )}
          </IconButton>
        </CardActions>
      </Box>
    );
  }
}

export default PhotosCard;
