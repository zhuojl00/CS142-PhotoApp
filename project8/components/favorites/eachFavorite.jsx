import React from "react";
// import Modal from "react-modal";
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
import {AiOutlineClose} from 'react-icons/ai';

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

class EachFavorite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOn: false,
    };
  }
  // do i need this?
  // componentDidMount() {
  //   Modal.setAppElement("body");
  // }

  getFavorite = () => {
    axios
      .get(`/favorites`)
      .then((response) => {
        this.setState({ favorites: response.data });
        console.log("getting favorites Completed");
      })
      .catch(() => this.setState({ favorites: [] }));
  };

  unFavorite = (photo) => {
    let url = `/favorites/${photo._id}`;
    axios
      .delete(url) // delete
      .then((response) => {
        console.log(response.data);
        this.getFavorites(); //refresh
      })
      .catch((error) => {
        alert("Failed to delete photo from favorites");
        console.log(error.response.data);
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
        <Card >
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
        <Dialog
          onClose={this.closeModal}
          open={this.state.modalOn}
        >
          <DialogContent>
            <img
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
