import React from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import "./userList.css";
import { withRouter } from "react-router";
import axios from "axios";

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userList: [],
    };
  }

  // get userList from window and set it to state
  componentDidMount() {
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

  displayDetails(id, name) {
    this.props.changeUser(name);
    this.props.changeView("Details");
    this.props.history.push(`/users/${id}`);
  }

  render() {
    return this.state.userList ? (
      <Box>
        <List component="nav" className="user-list">
          {this.state.userList.map((elem, i) => {
            return (
              <ListItem
                key={i}
                onClick={() => this.displayDetails(elem._id, elem.first_name)}
              >
                <ListItemText
                  primary={
                    (
                    <Typography variant="h6" color="primary">
                      {`${elem.first_name} ${elem.last_name}`}
                    </Typography>
                    )
                  }
                />
              </ListItem>
            );
          })}
          <Divider />
        </List>
      </Box>
    ) : (
      <Box />
    );
  }
}

export default withRouter(UserList);
