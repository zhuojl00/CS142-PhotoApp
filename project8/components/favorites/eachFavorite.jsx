import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Card,
    CardMedia,
    CardHeader,
    IconButton
} from "@material-ui/core";

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
      // array of objects, each with _id, date_time and file_name
      modalOn: false,
    };
  }
  // do i need this?
  componentDidMount() {
    Modal.setAppElement("body");
  }

  getFavorite = () => {
    axios
      .get(`/getFavoritePhotos`)
      .then((response) => {
        this.setState({ favorites: response.data });
        console.log("getFavoritePhotos Completed");
      })
      .catch(() => this.setState({ favorites: [] }));
  };

  unFavorite = (photo) => {
    let url = `/getFavoritePhotos/${photo._id}`;
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
      <div>
        <Card>
          <CardHeader
            action={
              <IconButton onClick={(event) => this.unFavorite(event)}>
                <Clear />
              </IconButton>
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
          aria-labelledby="customized-dialog-title"
          open={this.state.modalOn}
        >
          <DialogTitle id="customized-dialog-title" onClose={this.closeModal}>
            {this.props.photo.date_time}
          </DialogTitle>
          <DialogContent>
            <img
              src={`/images/${this.props.photo.file_name}`}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default EachFavorite;
