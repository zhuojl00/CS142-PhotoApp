import React from "react";
import axios from "axios";
import { Box, Button, CardActions, IconButton } from "@material-ui/core";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

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
    // if (this.props.alreadyFavorites.includes(this.props.photoId)) {
    //   axios
    //     .delete(`/addFavorites/${this.props.photoId}`, {})
    //     .then((response) => {
    //       this.props.updateCards();

    //       console.log(response.data);
    //     })
    //     .catch((error) => {
    //       console.log(error.response.data);
    //     });
    // } else {
    //   axios
    //     .post(`/addFavorites/${this.props.photoId}`, {})
    //     .then((response) => {
    //       this.props.updateCards();

    //       console.log(response.data);
    //     })
    //     .catch((error) => {
    //       console.log(error.response.data);
    //     });
    // }
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
              <BsBookmarkFill />
            ) : (
              <BsBookmark />
            )}
          </IconButton>
        </CardActions>
      </Box>
    );
  }
}

export default PhotosCard;
