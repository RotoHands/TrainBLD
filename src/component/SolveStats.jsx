import React, { Component } from "react";
import TableScrollbar from 'react-table-scrollbar';
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
        <TableScrollbar>
          <table id="solves">
            <tbody>{this.props.renderTable}</tbody>
          </table>
        </TableScrollbar>
      </React.Fragment>
    );
  }
}

export default SolveStats;
