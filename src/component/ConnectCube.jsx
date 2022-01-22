import React, { Component } from "react";
class ConnectCube extends React.Component {
  state = {};
  render() {
    const onConnect = this.props.onConnect;
    return (
      <React.Fragment>
        <button
          className="connect_cube_1 btn btn-primary m-1"
          onClick={onConnect}
        >
          Connect Cube
        </button>
      </React.Fragment>
    );
  }
}

export default ConnectCube;
