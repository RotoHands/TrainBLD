// based on rubiks-cube-scramble and cubing.js
import React, { Component } from "react";
import scramble from "rubiks-cube-scramble";
import { ScrambleDisplay } from "scramble-display";
class Scrambler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scramble: this.props.scramble,
    };
  }
 

  render() {
    return (
      <div>
        <button className="btn btn-primary m-2" onClick={this.props.onClick_scramble}>
          {" "}
          scramble
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
