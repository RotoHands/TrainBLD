import React, { Component } from "react";
class ConnectCube extends React.Component {
  state = {};
  render() {
    const onConnect = this.props.onConnect;
    return (
      <React.Fragment>
        <button
          className="btn btn-primary   m-1 ms-5 text-sm-start"
          onClick={onConnect}
          style={{ width: "180px" }}
        >
          Connect Cube
        </button>
      </React.Fragment>
    );
  }
}

export default ConnectCube;
