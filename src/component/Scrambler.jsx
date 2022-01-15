// based on sr-scrambler and cubing.js
import React, { Component } from "react";
import scramble from "rubiks-cube-scramble";
class Scrambler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scramble: this.props.scramble,
      last_scramble: this.props.last_scramble,
    };
  }

  render() {
    return (
      <div className="row m-1">
        <div className="col-8 mt-1">
          <div
            className="text-center"
            style={{ fontFamily: "Rubik", fontSize: "1.5vw", height: "2.5em" }}
          >
            {this.props.scramble}
          </div>
        </div>
        <div className="col-4">
          <div className="btn-toolbar " role="group" aria-label="Basic example">
            <button
              style={{ fontSize: "1.1vw" }}
              className="btn btn-primary m-1 btn-sm "
              onClick={this.props.onClick_last_scramble}
            >
              {" "}
              Last
            </button>
            <button
              style={{ fontSize: "1.1vw" }}
              className="btn btn-primary m-1 btn-sm"
              onClick={this.props.onClick_scramble}
            >
              {" "}
              Next
            </button>
            <button
              style={{ fontSize: "1.1vw" }}
              className="btn btn-primary  m-1"
              // style={{ width: "140px" }}
              onClick={this.props.onReset}
            >
              Reset moves
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Scrambler;
