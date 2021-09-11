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
      <div className="row m-2">
        <div className="col-9 mt-1">
          <div
            className="text-end"
            style={{ fontFamily: "Rubik", fontSize: 28 }}
          >
            {this.props.scramble}
          </div>
        </div>
        <div className="col-3">
          <div className="btn-toolbar" role="group" aria-label="Basic example">
            <button
              className="btn btn-primary m-1 "
              onClick={this.props.onClick_last_scramble}
            >
              {" "}
              Last
            </button>
            <button
              className="btn btn-primary m-1"
              onClick={this.props.onClick_scramble}
            >
              {" "}
              Next
            </button>
            <button
              className="btn btn-primary m-1"
              // style={{ width: "140px" }}
              onClick={this.handle_reset_cube}
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
