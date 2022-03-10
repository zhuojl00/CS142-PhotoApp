import React from "react";
import axios from "axios";
import {
  Grid,
  Typography,
} from "@material-ui/core";
import EachFavorite from "./eachFavorite";

class FavoritePhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // array of objects, each with _id, date_time and file_name
      favorites: [],
    };
  }

  updateCards = () => {
    axios
      .get(`/getFavoritePhotos`)
      .then(response => {
        this.setState({ favorites: response.data });
        console.log("getFavoritePhotos Completed");
      })
      .catch(() => this.setState({ favorites: [] }));
  };
  
  render() {
    return (
      <Grid container justify="space-evenly" alignItems="flex-start">
        <Grid item xs={12}>
        {/* pass in user first and last name? */}
          <Typography variant="h3">Favorite photos</Typography>
          <Divider />
        </Grid>
        {this.state.favorites.map(photo => (
          <Grid item xs={2} key={photo.file_name}>
            <EachFavorite updateCards={this.updateCards} photo={photo} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default FavoritePhotos;

