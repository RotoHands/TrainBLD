// based on sr-scrambler and cubing.js
import React, { Component } from "react";
import scramble from "rubiks-cube-scramble";
import { ScrambleDisplay } from "scramble-display";
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
      <div>
        <button
          className="btn btn-primary m-2"
          onClick={this.props.onClick_last_scramble}
        >
          {" "}
          Last scramble
        </button>
        <button
          className="btn btn-primary m-2"
          onClick={this.props.onClick_scramble}
        >
          {" "}
          Next scramble
        </button>
        <div>
          <scramble-display scramble={this.props.scramble}></scramble-display>
        </div>
        <div className="m-2">{this.props.scramble}</div>
      </div>
    );
  }
}

export default Scrambler;
