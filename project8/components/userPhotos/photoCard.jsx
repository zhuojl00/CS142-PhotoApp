import React from "react";
import axios from "axios";
import { Box, Button, CardActions, IconButton } from "@material-ui/core";
// import { Favorite, FavoriteBorder } from "@material-ui/icons";
// import BookmarkIcon from '@mui/icons-material/Bookmark';

class PhotosCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addFavorites = () => {
    // if already in favorites remove else add to favorites
    if (this.props.alreadyFavorites.includes(this.props.photoId)) {
      axios
        .delete(`/addFavorites/${this.props.photoId}`, {})
        .then((response) => {
          this.props.updateCards();

          console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    } else {
      axios
        .post(`/addFavorites/${this.props.photoId}`)
        .then((response) => {
          this.props.updateCards();

          console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  };
  render() {
    return (
      <Box>
        <CardActions disableSpacing>
          <Button onClick={this.addFavorites}> FAVORITE </Button>
          <IconButton
            placeholder="favorite"
            title="add to favorites"
            onClick={this.addFavorites}
          >
            {/* {this.props.alreadyFavorites.includes(this.props.photoId) ? (
                      <Button color="secondary" placeholder="favorite" />
                    ) : (
                      <Button placeholder="favorite" />
                    )} */}
          </IconButton>
        </CardActions>
      </Box>
    );
  }
}

export default PhotosCard;
