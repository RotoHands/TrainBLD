import React, { Component } from "react";
class SolveStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      solves: this.props.solves_stats,
    };
  }

  render() {
    return (
      <React.Fragment>
        
          <table id="solves">
            <tbody>{this.props.renderTable}</tbody>
          </table>
      </React.Fragment>
    );
  }
}

export default SolveStats;
