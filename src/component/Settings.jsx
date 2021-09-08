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
    setting_save: null,
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

  handle_save_setting = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        DIFF_BETWEEN_ALGS: "0.89",
        SMART_CUBE: "True",
        COMMS_UNPARSED: "False",
        EDGES_BUFFER: "UF",
        CORNER_BUFFER: "UFR",
        PARSE_TO_LETTER_PAIR: "True",
        GEN_WITH_MOVE_COUNT: "True",
        LETTER_PAIRS_DICT:
          "{'UBL': 'א', 'UBR': 'ב', 'UFL': 'ד', 'UFR': 'ג', 'RFU': 'מ', 'RBU': 'נ', 'RFD': 'ע', 'RBD': 'ס', 'FUL': 'ט', 'FUR': 'י', 'FDL': 'ל', 'FRD': 'כ', 'DFL': \"צ'\", 'DFR': 'ת', 'DBL': \"ג'\", 'DBR': 'ש', 'LBU': 'ה', 'LFU': 'ו', 'LDB': 'ח', 'LFD': 'ז', 'BUR': 'פ', 'BUL': 'צ', 'BRD': 'ר', 'BLD': 'ק', 'UB': 'א', 'UL': 'ד', 'UR': 'ב', 'UF': 'ג', 'RU': 'מ', 'RF': 'ע', 'RB': 'נ', 'RD': 'ס', 'FU': 'ט', 'FL': 'ל', 'FR': 'י', 'FD': 'כ', 'DF': \"צ'\", 'DL': \"ג'\", 'DR': 'ת', 'DB': 'ש', 'LU': 'ה', 'LB': 'ח', 'LF': 'ו', 'LD': 'ז', 'BU': 'פ', 'BR': 'ר', 'BL': 'צ', 'BD': 'ק'}",
        GEN_PARSED_TO_CUBEDB: "True",
        NAME_OF_SOLVE: "example_smart_cube",
        TIME_SOLVE: "56.12",
        SCRAMBLE: "R2 U' B2 F2 L2 U' R2 D F2 U2 B2 R' D' L' D F' D2 B2 D2 L2\n",
        SOLVE:
          "\n U' F' B U B U' F B' R B' R' U U' D R' U' D B B U D' R' U D' \n R U' R' U D' F U F' U' D R' F R F' B U' U' F B' R F' R U' U'\n L D U' F' U' F U D' L' U' U D' F U' D R' U' R U D' F' D R F' \n L' F R' L D' L D L' D' L' D R L' F' L F R' L U' D' R' U U R'\n D R U U R' D' R2 U D D R U R' D R U' R' D D R' U R' D' R U \n U R' D R U R R' D' R D R' D' R U U R' D R D' R' D R U U",
        MEMO: "23.32",
      }),
    };
    fetch("http://127.0.0.1:8080", requestOptions).then((response) =>
      response.text().then((data) => console.log(data))
    );
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
                <Tab eventKey="third" title="Import setting"></Tab>
                <Tab eventKey="forth" title="Save Setting">
                  <button
                    onClick={this.handle_save_setting}
                    className="btn btn-primary btn-sm-2 m-2"
                  >
                    Save Settings
                  </button>
                  <span>{this.state.setting_save}</span>
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
