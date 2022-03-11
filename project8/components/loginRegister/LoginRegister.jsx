import React from "react";
import { Box, Button, Typography, TextField } from "@material-ui/core";
import "./LoginRegister.css";
import axios from "axios";
import { withRouter } from "react-router";

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginAttempt: "",
      passwordAttempt: "",
      failedLogin: "",
      failedRegister: "",
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleNewUser = this.handleNewUser.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    axios.get("/admin/isLoggedIn").then((res) => {
      if (!res.data) {
        return;
      }
      this.props.logIn(res.data);
      this.props.history.push(`/users/${res.data._id}`);
    });
  }

  handleLogin(event) {
    console.log("handleLogin is called");
    event.preventDefault();
    axios
      .post("/admin/login", {
        login_name: this.state.loginAttempt,
        password: this.state.passwordAttempt,
      })
      .then((response) => {
        console.log("Login Sucess");
        this.setState({ failedLogin: "" });
        let user = response.data;
        this.props.logIn(user);
        this.props.history.push(`/users/${user._id}`);
      })
      .catch((err) => {
        this.setState({ failedLogin: err.response.data });
      });
  }

  handleNewUser(event) {
    event.preventDefault();
    if (this.state.registerPassword1 !== this.state.registerPassword2) {
      this.setState({
        failedRegister:
          "Register Failed. Please try again. Make sure all fields are filled in and passwords match.",
      });
      return;
    }
    axios
      .post("/user", {
        login_name: this.state.newUserName,
        password: this.state.registerPassword1,
        password2: this.state.registerPassword2,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        location: this.state.location,
        description: this.state.description,
        occupation: this.state.occupation,
      })
      .then((response) => {
        console.log("register");
        this.setState({ failedRegister: "" });
        let user = response.data;
        this.props.logIn(user);
        // new http call
        window.location.href = `#/users/${user._id}`;
      })
      .catch((err) => {
        this.setState({ failedRegister: err.response.data });
      });
  }

  handleInputChange(event) {
    this.setState(event);
  }

  render() {
    return (
      <Box className="container">
        <Typography variant="h5" color="inherit">
          Please log in with your username and password.
        </Typography>
        {(this.state.failedLogin || this.state.failedRegister) && (
          <Typography variant="h5" color="error">
            {this.state.failedLogin || this.state.failedRegister} :(
          </Typography>
        )}
        <form onSubmit={this.handleLogin}>
          <TextField
            required
            fullWidth
            type="text"
            label="Login Name"
            value={this.state.login_name}
            onChange={(event) => {
              this.handleInputChange({ loginAttempt: event.target.value });
            }}
            variant="outlined"
            margin="dense"
          />
          <TextField
            required
            fullWidth
            type="text"
            label="Password"
            value={this.state.password}
            onChange={(event) => {
              this.handleInputChange({ passwordAttempt: event.target.value });
            }}
            variant="outlined"
            margin="dense"
          />
          <Button
            variant="contained"
            color="primary"
            label="Submit"
            type="submit"
            style={{ marginTop: "15px" }}
          >
            Submit
          </Button>
        </form>
        <br />
        <Typography variant="h5" color="inherit">
          New user? Sign up below:
        </Typography>
        <form onSubmit={this.handleNewUser}>
          <TextField
            fullWidth
            type="text"
            label="New User Login"
            value={this.state.newUserName || ""}
            onChange={(event) => {
              this.handleInputChange({ newUserName: event.target.value });
            }}
            variant="outlined"
            margin="dense"
          />
          <TextField
            fullWidth
            type="text"
            label="Password"
            value={this.state.registerPassword1 || ""}
            onChange={(event) => {
              this.handleInputChange({ registerPassword1: event.target.value });
            }}
            variant="outlined"
            margin="dense"
          />
          <TextField
            fullWidth
            type="text"
            label="Verify Password"
            value={this.state.registerPassword2 || ""}
            onChange={(event) => {
              this.handleInputChange({ registerPassword2: event.target.value });
            }}
            variant="outlined"
            margin="dense"
          />
          <TextField
            fullWidth
            type="text"
            label="First Name"
            value={this.state.first_name || ""}
            onChange={(event) => {
              this.handleInputChange({ first_name: event.target.value });
            }}
            margin="dense"
            variant="outlined"
          />
          <TextField
            fullWidth
            type="text"
            label="Last Name"
            value={this.state.last_name || ""}
            onChange={(event) => {
              this.handleInputChange({ last_name: event.target.value });
            }}
            margin="dense"
            variant="outlined"
          />
          <TextField
            fullWidth
            type="text"
            value={this.state.location || ""}
            onChange={(event) => {
              this.handleInputChange({ location: event.target.value });
            }}
            margin="dense"
            variant="outlined"
            label="Location"
          />
          <TextField
            fullWidth
            type="text"
            value={this.state.description || ""}
            onChange={(event) => {
              this.handleInputChange({ description: event.target.value });
            }}
            margin="dense"
            variant="outlined"
            label="Description"
          />
          <TextField
            fullWidth
            type="text"
            value={this.state.occupation || ""}
            onChange={(event) => {
              this.handleInputChange({ occupation: event.target.value });
            }}
            margin="dense"
            variant="outlined"
            label="Occupation"
          />
          <Button
            variant="contained"
            color="secondary"
            label="Submit"
            type="submit"
            style={{ marginTop: "15px" }}
          >
            Register
          </Button>
        </form>
      </Box>
    );
  }
}

export default withRouter(LoginRegister);
