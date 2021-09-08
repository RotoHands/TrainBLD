import React, { useState, Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Accordion from "react-bootstrap/Accordion";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";
import SettingGeneral from "./SettingsGeneral";
import SettingLetterScheme from "./SettingLetterScheme";

class Setting extends React.Component {
  
  state = {
    parse_with_letter_pair: true,
    gen_with_move_count: true,
    edge_buffer: "UF",
    corner_buffer: "UFR",
    letter_pair_dict: {
      UBL: "A",
      UBR: "B",
      UFR: "C",
      UFL: "D",
      LBU: "E",
      LFU: "F",
      LFD: "G",
      LDB: "H",
      FUL: "I",
      FUR: "J",
      FRD: "K",
      FDL: "L",
      RFU: "M",
      RBU: "N",
      RBD: "O",
      RFD: "P",
      BUR: "Q",
      BUL: "R",
      BLD: "S",
      BRD: "T",
      DFL: "U",
      DFR: "V",
      DBR: "W",
      DBL: "X",
      UB: "A",
      UR: "B",
      UF: "C",
      UL: "D",
      LU: "E",
      LF: "F",
      LD: "G",
      LB: "H",
      FU: "I",
      FR: "J",
      FD: "K",
      FL: "L",
      RU: "M",
      RB: "N",
      RD: "O",
      RF: "P",
      BU: "Q",
      BL: "R",
      BD: "S",
      BR: "T",
      DF: "U",
      DR: "V",
      DB: "W",
      DL: "X",
    },
  };

  handle_move_count_change = (event) => {
    this.setState({ gen_with_move_count: event.target.checked });
  };
  handle_apply_letter_pairs_change = (event) => {
    this.setState({ parse_with_letter_pair: event.target.checked });
  };
  handle_corner_buffer = (event) => {
    this.setState({ corner_buffer: event.target.value });
  };
  handle_edge_buffer = (event) => {
    this.setState({ edge_buffer: event.target.value });
  };

  handle_letter_pair_dict = (event) => {
    const letter_pair_dict_new = { ...this.state.letter_pair_dict };
    letter_pair_dict_new[event.target.id] = event.target.value;
    this.setState({ letter_pair_dict: letter_pair_dict_new });
  };

  render() {
    return (
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>setting</Accordion.Header>
          <Accordion.Body>
            <div>
              <Tabs defaultActiveKey="first">
                <Tab eventKey="first" title="General">
                  <SettingGeneral
                    diff={this.state.diff}
                    parse_with_letter_pair={this.state.parse_with_letter_pair}
                    onChange_move_count={this.handle_move_count_change}
                    onChange_apply_letter_pair={
                      this.handle_apply_letter_pairs_change
                    }
                    onChange_corner_buffer={this.handle_corner_buffer}
                    onChange_edge_buffer={this.handle_edge_buffer}
                    gen_to_cube_db={this.state.gen_to_cube_db}
                    edge_buffer={this.state.edge_buffer}
                    corner_buffer={this.state.corner_buffer}
                  />
                </Tab>
                <Tab eventKey="second" title="letter scheme">
                  <SettingLetterScheme
                    letter_pair_dict={this.state.letter_pair_dict}
                    onChange_letter_pair_dict={this.handle_letter_pair_dict}
                  />
                </Tab>
                <Tab eventKey="third" title="Import setting">
                  Hii, I am 3rd tab content
                </Tab>
                <Tab eventKey="forth" title="Save Setting">
                  Hii, I am 3rd tab content
                </Tab>
              </Tabs>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }
}

export default Setting;
