import React from "react";
import { Typography } from "@material-ui/core";
import { withRouter } from "react-router";

class SelectUser extends React.Component {
  constructor(props) {
    super(props);
    console.log("P", props);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          position: "absolute",
          left: `${this.props.x - 80}px`,
          top: `${this.props.y + 0}px`,
          overflow: "auto",
          height: "150px",
          width: "80px",
          zIndex: 999,
        }}
      >
        {this.props.userOptions &&
          this.props.userOptions.map((option) => {
            return (
              <div
                style={{ cursor: "pointer", background: "white" }}
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.handleMakeTag(option);
                }}
              >
                <Typography>
                  {`${option.first_name} ${option.last_name}`}
                </Typography>
              </div>
            );
          })}
      </div>
    );
  }
}

export default withRouter(SelectUser);
