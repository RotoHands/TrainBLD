// based on rubiks-cube-scramble and cubing.js
import React, { Component } from "react";
import scramble from "rubiks-cube-scramble";
import scrambleGenerator from "rubiks-cube-scramble";
import ScriptTag from "react-script-tag";
class Scrambler extends React.Component {
  state = {
    scramble: null,
  };
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
        <ScriptTag
          src="https://cdn.cubing.net/esm/cubing/twisty"
          type="module"
          defer
        >
          {" "}
        </ScriptTag>
        <div>
          <twisty-player
            alg={this.state.scramble}
            visualization="2D"
          ></twisty-player>{" "}
        </div>
        <div className="m-2">{this.state.scramble}</div>
      </div>
    );
  }
}

export default Scrambler;
