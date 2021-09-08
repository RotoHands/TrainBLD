import React, { Component } from "react";
class ConnectCube extends React.Component {
  state = {};
  render() {
    const onConnect = this.props.onConnect;
    return (
      <React.Fragment>
        <button className="btn btn-primary m-3" onClick={onConnect}>
          Connect Cube
        </button>
      </React.Fragment>
    );
  }
}

export default ConnectCube;
