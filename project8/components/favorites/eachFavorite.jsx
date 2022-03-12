import React from "react";
import axios from "axios";
import {
  Box,
  Dialog,
  DialogContent,
  Card,
  CardMedia,
  CardHeader,
  Typography,
} from "@material-ui/core";
import { AiOutlineClose } from "react-icons/ai";

class EachFavorite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOn: false,
    };
  }

  unFavorite = (event) => {
    event.preventDefault();
    axios
      .get(`/deleteFavorites/${this.props.photo._id}`)
      .then((response) => {
        console.log(response.data);
        this.props.updateCards(); //refresh
      })
      .catch((error) => {
        alert("Failed to delete photo from favorites");
        console.log(error);
      });
  };

  openModal = () => {
    this.setState({ modalOn: true });
  };

  closeModal = () => {
    this.setState({ modalOn: false });
  };

  render() {
    return (
      <Box>
        <Card>
          <CardHeader
            action={
              <AiOutlineClose onClick={(event) => this.unFavorite(event)} />
            }
          />
          <CardMedia
            component="img"
            image={`/images/${this.props.photo.file_name}`}
            onClick={this.openModal}
          />
        </Card>
        <Dialog onClose={this.closeModal} open={this.state.modalOn}>
          <DialogContent>
            <Typography color="secondary" variant="subtitle1">
              {" "}
              Click anywhere outside of the popup or hit esc key to exit this
              window :)
            </Typography>
            <img
              className="enlarged-image"
              src={`/images/${this.props.photo.file_name}`}
            />
            <Typography> Posted {this.props.photo.date_time} </Typography>
          </DialogContent>
        </Dialog>
      </Box>
    );
  }
}

export default EachFavorite;
