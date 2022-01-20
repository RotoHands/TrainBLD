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
      <table class="solve_stats_body">
        <tbody >{this.props.renderTable}</tbody>
      </table>
    );
  }
}

export default SolveStats;
