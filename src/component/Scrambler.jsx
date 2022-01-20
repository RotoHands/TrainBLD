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
            className="text-center scramble_seq"
          >
            {this.props.scramble}
          </div>
        </div>
        <div className="col-4">
          <div className="btn-toolbar last_btn" role="group" aria-label="Basic example">
            <button
              className="btn btn-primary m-1 btn-sm last_btn"
              onClick={this.props.onClick_last_scramble}
            >
              {" "}
              Last
            </button>
            <button
              className="btn btn-primary m-1 btn-sm next_btn"
              onClick={this.props.onClick_scramble}
            >
              {" "}
              Next
            </button>
            <button
              className="btn btn-primary  m-1 reset_moves"
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
