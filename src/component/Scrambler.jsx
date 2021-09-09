// based on rubiks-cube-scramble and cubing.js
import React, { Component } from "react";
import scramble from "rubiks-cube-scramble";
import scrambleGenerator from "rubiks-cube-scramble";
import ScriptTag from "react-script-tag";
import { ScrambleDisplay } from "scramble-display";
class Scrambler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scramble: null,
    };
  }
  componentDidMount() {
    this.handle_scramble();
  }
  handle_scramble = () => {
    this.setState({ scramble: scrambleGenerator() });
  };
  render() {
    return (
      <div>
        <button className="btn btn-primary m-2" onClick={this.handle_scramble}>
          {" "}
          scramble
        </button>
        <div>
          <scramble-display scramble={this.state.scramble}></scramble-display>
        </div>
        <div className="m-2">{this.state.scramble}</div>
      </div>
    );
  }
}

export default Scrambler;
