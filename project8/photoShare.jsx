import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { Grid, Typography, Paper } from "@material-ui/core";
import "./styles/main.css";
import fetchModel from "./lib/fetchModelData";

// import necessary components
import TopBar from "./components/topBar/TopBar";
import UserDetail from "./components/userDetail/userDetail";
import UserList from "./components/userList/userList";
import UserPhotos from "./components/userPhotos/userPhotos";
import LoginRegister from "./components/loginRegister/LoginRegister";

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: "Home",
      name: "Jialin",
      version: null,
      advancedFeatures: false,
      current_user: "",
    };
  }
  componentDidMount() {
    const res = fetchModel(`http://localhost:3000/test/info`);
    res.then((response) => {
      this.setState({ version: response.data });
    });
  }

  changeView = (newView) => {
    this.setState({ view: newView });
  };

  changeUser = (userName) => {
    this.setState({ name: userName });
  };

  toggling = () => {
    this.setState({ advancedFeatures: !this.state.advancedFeatures });
  };

  turnOnAF = () => {
    this.setState({ advancedFeatures: true });
  };

  logIn = (newUser) => {
    this.setState({ current_user: newUser });
  };

  logOut = (history) => {
    axios
      .post("/admin/logOut", {})
      .then(() => {
        this.setState({ current_user: null });
        history.push("/");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    return (
      <HashRouter>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <TopBar
                view={this.state.view}
                user={this.state.name}
                version={this.state.version}
                current_user={this.state.current_user}
                advancedFeatures={this.state.advancedFeatures}
                changeUser={this.changeUser}
                changeView={this.changeView}
                toggling={this.toggling}
                logOut={this.logOut}
                logIn={this.logIn}
              />
            </Grid>
            <div className="cs142-main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="cs142-main-grid-item">
                {this.state.current_user && (
                  <UserList
                    changeView={this.changeView}
                    changeUser={this.changeUser}
                  />
                )}
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="cs142-main-grid-item">
                <Switch>
                  <Route exact path="/login-register">
                    {!this.state.current_user ? (
                      <LoginRegister logIn={this.logIn} />
                    ) : (
                      <Redirect path="/login-register" to="/" />
                    )}
                  </Route>

                  {this.state.current_user ? (
                    <Route
                      path="/users/:userId"
                      render={(props) => {
                        return (
                          <UserDetail changeView={this.changeView} {...props} />
                        );
                      }}
                    />
                  ) : (
                    <Redirect path="/users/:userId" to="/login-register" />
                  )}
                  {this.state.current_user ? (
                    <Route
                      path="/photos/:userId/:photoId"
                      render={(props) => {
                        return (
                          <UserPhotos
                            advancedFeatures={this.state.advancedFeatures}
                            turnOnAF={this.turnOnAF}
                            {...props}
                          />
                        );
                      }}
                    />
                  ) : (
                    <Redirect path="/users/:userId" to="/login-register" />
                  )}
                  {this.state.current_user ? (
                    <Route
                      path="/photos/:userId/"
                      render={(props) => {
                        return (
                          <UserPhotos
                            currentUser={this.state.current_user}
                            advancedFeatures={this.state.advancedFeatures}
                            {...props}
                          />
                        );
                      }}
                    />
                  ) : (
                    <Redirect path="/users/:userId" to="/login-register" />
                  )}
                  {this.state.current_user ? (
                    <Route path="/users" component={UserList} />
                  ) : (
                    <Redirect path="/users/:userId" to="/login-register" />
                  )}

                  {this.state.current_user ? (
                    <Route path="/">
                      <Typography>Welcome</Typography>
                    </Route>
                  ) : (
                    <Redirect path="/" to="/login-register" />
                  )}
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    );
  }
}

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
