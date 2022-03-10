import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import "./userDetail.css";
import { withRouter } from "react-router";
import axios from "axios";

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
    };
  }

  componentDidMount() {
    // get user id from url with the id
    // let res = window.cs142models.userModel(this.props.match.params.userId);
    // this.setState({ userInfo: res });
    let userId = this.props.match.params.userId;
    axios
      .get(`/user/${userId}`)
      .then((response) => {
        console.log("response", response);
        this.setState({ userInfo: response.data });
      })
      .catch((err) => console.log(err.response));
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.userId !== prevProps.match.params.userId) {
      this.componentDidMount();
    }
  }
  displayDetails() {
    this.props.changeView("Photos");
    this.props.history.push(`/photos/${this.props.match.params.userId}`);
  }

  render() {
    return this.state.userInfo ? (
      <Box p={10}>
        <Typography variant="h3">
          {this.state.userInfo.first_name} {this.state.userInfo.last_name}
        </Typography>
        <Typography>
          <b>Occupation: </b> {this.state.userInfo.occupation}
        </Typography>
        <Typography>
          <b>Location: </b> {this.state.userInfo.location}
        </Typography>
        <Typography>
          <b>Description: </b> {this.state.userInfo.description}
        </Typography>
        <Box mt={2}>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={() => this.displayDetails()}
          >
            Photos
          </Button>
        </Box>
      </Box>
    ) : (
      <Box />
    );
  }
}

export default withRouter(UserDetail);
