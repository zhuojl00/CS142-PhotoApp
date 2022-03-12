import React from "react";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import "./TopBar.css";
import { matchPath, withRouter } from "react-router";
import axios from "axios";
/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      uploadDialog: false,
      userVisibility: false,
      selectedUsers: [],
    };
  }

  componentDidMount() {
    const path = this.props.history.location.pathname;
    const match = matchPath(path, {
      path: "/:any/:id",
    });
    if (match?.params?.id) {
      axios
        .get(`/user/${match.params.id}`)
        .then((response) => {
          this.props.changeUser(response.data.first_name);
        })
        .catch((err) => console.log(err.response));
    }
    if (match?.params) {
      if (match.params.any === "users") {
        this.props.changeView("Details");
      } else {
        this.props.changeView("Photos");
      }
    }
    axios
      .get(`/user/list`)
      .then((response) => {
        console.log(response.data);
        this.setState({ userList: response.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.current_user !== this.props.current_user) {
      axios
        .get(`/user/list`)
        .then((response) => {
          console.log(response.data);
          this.setState({
            userList: response.data,
            userVisibility: false,
            selectedUsers: [],
          });
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }
  handleDialogClickToOpen = () => {
    this.setState({ uploadDialog: true });
  };

  handleDialogClose = () => {
    this.setState({ uploadDialog: false });
  };

  handleUploadSubmitButtonClicked = (e) => {
    e.preventDefault();
    if (!this.state.userVisibility) {
      this.setState({
        selectedUsers: this.state.userList.map(({ _id }) => {
          return { [_id]: true };
        })
      });
    }
    if (this.uploadInput.files.length > 0) {
      // Create a DOM form and add the file to it under the name uploadedphoto
      const domForm = new FormData();
      domForm.append("uploadedphoto", this.uploadInput.files[0]);
      domForm.append("selectedUsers", JSON.stringify(this.state.selectedUsers));
      axios
        .post("/photos/new", domForm)
        .then((res) => {
          alert("Photo uploaded successfully!")
          this.setState({
            uploadDialog: false,
            userVisibility: false,
            selectedUsers: [],
          });
          console.log(res);
          this.props.history.push(
            `/photos/${this.props.current_user._id}`
          );
        })
        .catch((err) => console.log(`POST ERR: ${err}`));
    }
  };

  turnOnSelectedVisibility = () => {
    this.setState({ userVisibility: !this.state.userVisibility });
  };

  handelVisibility = (id) => {
    console.log(id)
    if (this.state.selectedUsers.includes(id)) {
      // remove the id
      this.setState({selectedUsers: this.state.selectedUsers.filter((_id) => id !== _id)})
    } else {
      // set user id to be checked
      this.setState({selectedUsers: [...this.state.selectedUsers, id]});
    }
  };

  render() {
    // console.log("userlist", this.state.userList);
    console.log("selectedUsers", this.state.selectedUsers)
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          {this.props.current_user ? (
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Typography variant="h5" color="inherit">
                JZ-APP
              </Typography>
              <Typography variant="h5" color="inherit">
                {this.props.current_user.first_name} {this.props.view} Page
                Version: {this.props.version && this.props.version.__v}
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography>Enable Advanced Features</Typography>
                <Checkbox
                  checked={this.props.advancedFeatures}
                  onChange={this.props.toggling}
                  color="default"
                />
              </Box>
              <Button
                onClick={this.handleDialogClickToOpen}
                variant="contained"
              >
                Upload
              </Button>
              <Dialog
                open={this.state.uploadDialog}
                onClose={this.handleDialogClose}
              >
                <DialogTitle>Upload A Photo Here</DialogTitle>
                <DialogContent>
                  <input
                    type="file"
                    accept="image/*"
                    ref={(domFileRef) => {
                      this.uploadInput = domFileRef;
                    }}
                  />
                  <br />
                  <List>
                    <Typography variant="h5">
                      Specify viewing permission?
                    </Typography>
                    <br />
                    {this.state.userList &&
                      this.state.userList.map((user) => {
                        const userId = user._id;
                        return (
                          <ListItem
                            key={userId}
                            role={undefined}
                            // dense
                            // button
                          >
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={this.state.selectedUsers[userId]}
                                onChange={() => this.handelVisibility(userId)}
                                value={userId}
                              />
                              <ListItemText>
                                {" "}
                                {user.first_name} {user.last_name}{" "}
                              </ListItemText>
                            </ListItemIcon> 
                          </ListItem>
                        );
                      })}
                  </List>
                  <Button
                    onClick={this.handleUploadSubmitButtonClicked}
                    variant="contained"
                  >
                    Submit Photo
                  </Button>
                </DialogContent>
              </Dialog>
              <Link to="/favorites" style={{ textDecoration: "none" }}>
                <Button variant="contained">Favorites</Button>
              </Link>
              <Button
                onClick={() => this.props.logOut(this.props.history)}
                variant="contained"
              >
                Log out
              </Button>
            </Grid>
          ) : (
            <Typography variant="h5">Please login</Typography>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

export default withRouter(TopBar);
