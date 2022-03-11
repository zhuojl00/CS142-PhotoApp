import React from "react";
import axios from "axios";
import { Grid, Typography } from "@material-ui/core";
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
      .get(`/favorites`)
      .then((response) => {
        this.setState({ favorites: response.data });
        console.log("Getting favorite photos Completed");
      })
      .catch(() => this.setState({ favorites: [] }));
  };

  render() {
    return (
      <Grid
        container
        spacing={0}
        direction="row"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <Typography variant="h5">Your Favorite Photos</Typography>
        </Grid>
        {this.state.favorites.map((photo) => (
          <Grid item xs={2} key={photo.file_name}>
            {/* <EachFavorite updateCards={this.updateCards} photo={photo} /> */}
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default FavoritePhotos;
