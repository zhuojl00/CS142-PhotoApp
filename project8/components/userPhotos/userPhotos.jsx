import React from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
// import { IconButton } from '@mui/material';
import { Link } from "react-router-dom";
import CommentsCard from "./commentsCard.jsx";
import PhotosCard from "./photoCard.jsx";
import "./userPhotos.css";
import TagPhotoContainer from "../photoWithTag/TagPhotoContainer";
/**
 * Define UserPhotos, a React componment of CS142 project #5
 */

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userPhoto: [],
      userInfo: {},
      userCurrentLocation: 0,
      favoriteIds: [], // ids of the photos curr user favorited
    };
    // this.addComment = this.addComment.bind(this);
  }

  componentDidMount() {
    let userId = this.props.match.params.userId;
    axios
      .get(`/photosOfUser/${userId}`)
      .then((response) => {
        this.setState({ userPhoto: response.data });
        const currPhotoId = this.props.match.params.photoId;
        if (currPhotoId) {
          this.props.turnOnAF(true);
          for (let i = 0; i < this.state.userPhoto.length; i++) {
            if (this.state.userPhoto[i]._id === currPhotoId) {
              this.setState({ userCurrentLocation: i });
            }
          }
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
    axios
      .get(`/user/${userId}`)
      .then((response) => {
        this.setState({ userInfo: response.data });
      })
      .catch((err) => console.log(err.response));
  }

  updateCards = () => {
    axios
      .get(`/favorites`)
      .then((response) => {
        this.setState({ favoriteIds: response.data.map((photo) => photo._id) });
      })
      .catch(() => this.setState({ favoriteIds: [] }));
    axios
      .get(`/photosOfUser/${userId}`)
      .then((response) => {
        this.setState({ userPhoto: response.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  previousClicked = () => {
    this.setState({
      userCurrentLocation: this.state.userCurrentLocation - 1,
    });
    const newPhoto =
      this.state.userPhoto[this.state.userCurrentLocation - 1]._id;
    const userId = this.props.match.params.userId;
    this.props.history.push(`/photos/${userId}/${newPhoto}`);
  };

  nextClicked = () => {
    this.setState({
      userCurrentLocation: this.state.userCurrentLocation + 1,
    });
    const newPhoto =
      this.state.userPhoto[this.state.userCurrentLocation + 1]._id;
    const userId = this.props.match.params.userId;
    this.props.history.push(`/photos/${userId}/${newPhoto}`);
  };

  addComment = (photoId, comment) => {
    console.log(this.state.userPhoto);
    const nextUserPhotos = this.state.userPhoto.reduce((acc, curr) => {
      if (curr._id !== photoId) {
        return [...acc, curr];
      }

      const currentComment = {
        user: this.props.currentUser,
        comment: comment,
        date_time: new Date().toISOString(),
      };

      const newPhoto = {
        ...curr,
        comments: [...curr.comments, currentComment],
      };

      return [...acc, newPhoto];
    }, []);

    this.setState({ userPhoto: nextUserPhotos });
  };

  render() {
    const photo = this.state.userPhoto;
    const user = this.state.userInfo;
    const currPhoto = photo[this.state.userCurrentLocation];
    return !this.props.advancedFeatures ? (
      <Box>
        {photo.map((elem, i) => {
          return (
            <Card key={i}>
              <Box pl={20} pr={20}>
                <CardHeader
                  title={`${user.first_name} ${user.last_name}`}
                  subheader={elem.date_time}
                />
                <TagPhotoContainer
                  src={`../../images/${elem.file_name}`}
                  photoId={elem._id}
                />
                <PhotosCard
                  photoId={elem._id}
                  updateCards={this.updateCards}
                  alreadyFavorites={this.state.favoriteIds}
                />
                <CardContent>
                  <Typography component={"div"}>
                    {elem.comments &&
                      elem.comments.map((comment, j) => {
                        return (
                          <Grid container key={j} className="comment-container">
                            <Grid item xs={2}>
                              <Link to={`/users/${comment.user._id}`}>
                                <Typography color="primary">
                                  {" "}
                                  {`${comment.user.first_name} ${comment.user.last_name}`}{" "}
                                </Typography>
                              </Link>
                              <Typography variant="subtitle2">
                                {" "}
                                {comment.date_time}{" "}
                              </Typography>
                            </Grid>
                            <Grid item xs={9}>
                              {comment.comment}
                            </Grid>
                          </Grid>
                        );
                      })}

                    <CommentsCard
                      photoId={elem._id}
                      addComment={this.addComment}
                    />
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          );
        })}
      </Box>
    ) : (
      <Box>
        <Button
          disabled={this.state.userCurrentLocation === 0}
          onClick={this.previousClicked}
          className="prev-button"
        >
          Previous
        </Button>
        <Button
          disabled={
            this.state.userCurrentLocation === this.state.userPhoto.length - 1
          }
          onClick={this.nextClicked}
          className="next-button"
        >
          Next
        </Button>

        <Card>
          <Box pl={20} pr={20}>
            {currPhoto && (
              <CardHeader
                title={`${user.first_name} ${user.last_name}`}
                subheader={currPhoto.date_time}
              />
            )}
            <Box textAlign="center">
              {currPhoto && <img src={`../../images/${currPhoto.file_name}`} />}
            </Box>
            {currPhoto && (
              <CardContent>
                <Typography component={"div"}>
                  {currPhoto.comments &&
                    currPhoto.comments.map((comment, j) => {
                      return (
                        <Box key={j}>
                          <Grid container className="comment-container">
                            <Grid item xs={2}>
                              <Link to={`/users/${comment.user._id}`}>
                                <Typography color="primary">
                                  {`${comment.user.first_name} ${comment.user.last_name}`}
                                </Typography>
                              </Link>
                              <Typography variant="subtitle2">
                                {" "}
                                {comment.date_time}{" "}
                              </Typography>
                            </Grid>
                            <Grid item xs={9}>
                              {comment.comment}
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
                </Typography>
              </CardContent>
            )}
          </Box>
        </Card>
      </Box>
    );
  }
}

export default UserPhotos;
