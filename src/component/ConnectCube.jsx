import React, { Component } from "react";
class ConnectCube extends React.Component {
  state = {};
  render() {
    const onConnect = this.props.onConnect;
    return (
      <React.Fragment>
        <button
          className="btn btn-primary ms-4 m-2  text-sm-start"
          onClick={onConnect}
          style={{ width: "13em" , fontSize:"1vw"}}
        >
          Connect Cube
        </button>
      </React.Fragment>
    );
  }
}

export default ConnectCube;
