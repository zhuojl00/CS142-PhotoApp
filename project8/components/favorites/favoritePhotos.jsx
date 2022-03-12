import React from "react";
import axios from "axios";
import { Grid, Typography } from "@material-ui/core";
import EachFavorite from "./eachFavorite";

class FavoritePhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  componentDidMount() {
    this.updateCards();
  }

  render() {
    return (
      <Grid
        container
        spacing={8}
        direction="row"
        alignItems="center"
      >
        <Grid item xs={12}>
          <Typography variant="h3">Your Favorite Photos</Typography>
        </Grid>
        {this.state.favorites.map((photo) => (
          <Grid item xs={3} key={photo.file_name}>
            <EachFavorite updateCards={this.updateCards} photo={photo} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default FavoritePhotos;
