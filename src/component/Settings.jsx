import React, { Component } from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Accordion from "react-bootstrap/Accordion";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";
import SettingGeneral from "./SettingsGeneral";
import SettingLetterScheme from "./SettingLetterScheme";
import Collapse from "react-bootstrap/Collapse";

class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state =
      localStorage.getItem("setting") === null
        ? {
            open: false,
            setting_save_statue: "",
            import_setting: {},
            setting_save: {},
            parse_with_letter_pair: true,
            gen_with_move_count: true,
            edge_buffer: "UF",
            corner_buffer: "UFR",
            GEN_PARSED_TO_CUBEDB: true,
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
          } : {
            open: false,
            setting_save_statue: "",
            import_setting: {},
            setting_save: {},
            parse_with_letter_pair:
              this.props.cur_setting["PARSE_TO_LETTER_PAIR"],
            gen_with_move_count: this.props.cur_setting["GEN_WITH_MOVE_COUNT"],
            edge_buffer: this.props.cur_setting["EDGES_BUFFER"],
            corner_buffer: this.props.cur_setting["CORNER_BUFFER"],
            GEN_PARSED_TO_CUBEDB: true,
            letter_pair_dict : JSON.parse(this.props.cur_setting["LETTER_PAIRS_DICT"]),
          };
  }
  componentDidMount() {
    if (localStorage.getItem("setting") !== null) {
      JSON.parse(localStorage.getItem("setting"));
      this.props.export_setting(JSON.parse(localStorage.getItem("setting")));
    } else {
      this.handle_save_setting();
    }
  }

  handle_move_count_change = (event) => {
    this.setState({ gen_with_move_count: event.target.checked });
    this.setState({ setting_save_statue: " - Changes unsaved" });
  };
  handle_apply_letter_pairs_change = (event) => {
    this.setState({ parse_with_letter_pair: event.target.checked });
    this.setState({ setting_save_statue: " - Changes unsaved" });
  };
  handle_corner_buffer = (event) => {
    this.setState({ corner_buffer: event.target.value });
    this.setState({ setting_save_statue: " - Changes unsaved" });
  };
  handle_edge_buffer = (event) => {
    this.setState({ edge_buffer: event.target.value });
    this.setState({ setting_save_statue: " - Changes unsaved" });
  };

  handle_letter_pair_dict = (event) => {
    const letter_pair_dict_new = { ...this.state.letter_pair_dict };
    letter_pair_dict_new[event.target.id] = event.target.value;
    this.setState({ letter_pair_dict: letter_pair_dict_new });
    this.setState({ setting_save_statue: " - Changes unsaved" });
  };

  handle_save_setting = () => {
    const setting = {
      EDGES_BUFFER: this.state.edge_buffer,
      CORNER_BUFFER: this.state.corner_buffer,
      PARSE_TO_LETTER_PAIR: this.state.parse_with_letter_pair,
      GEN_WITH_MOVE_COUNT: this.state.gen_with_move_count,
      GEN_PARSED_TO_CUBEDB: this.state.GEN_PARSED_TO_CUBEDB,
      ID: this.props.id,
      LETTER_PAIRS_DICT: JSON.stringify(this.state.letter_pair_dict),
    };
    this.setState({ setting_save: setting });
    this.props.export_setting(setting);
    this.setState({ setting_save_statue: "" });
  };
  handle_import_onClick = (event) => {
    let new_settings = JSON.parse(this.state.import_setting);
    this.setState({ setting_save: JSON.parse(this.state.import_setting) });
    this.props.export_setting(new_settings);
  };
  handle_import_onChange = (event) => {
    let setting = event.target.value;
    this.setState({ import_setting: setting });
  };
  handle_cubedb_txt = (event) => {
    this.setState({ GEN_PARSED_TO_CUBEDB: event.target.checked });
    this.setState({ setting_save_statue: " - Changes unsaved" });
  };

  render() {
    return (
      <React.Fragment>
        <button
          className="btn btn-primary m-2 ms-4 mb-3 text-sm-start"
          style={{ width: "180px" }}
          onClick={() => this.setState({ open: !this.state.open })}
          aria-controls="example-collapse-text"
          aria-expanded={this.state.open}
        >
          Settings
          <div className="primary">{this.state.setting_save_statue}</div>
        </button>
        <div className="text-black" style={{ fontSize: 20 }}>
          <Collapse in={this.state.open}>
            <div style={{ fontFamily: "Rubik" }} id="example-collapse-text">
              <div>
                <Tabs defaultActiveKey="first">
                  <Tab eventKey="first" title="General">
                    <SettingGeneral
                      handle_save_setting={this.handle_save_setting}
                      id={this.props.id}
                      onChange_cubedb={this.handle_cubedb_txt}
                      parse_with_letter_pair={this.state.parse_with_letter_pair}
                      onChange_move_count={this.handle_move_count_change}
                      onChange_apply_letter_pair={
                        this.handle_apply_letter_pairs_change
                      }
                      onChange_corner_buffer={this.handle_corner_buffer}
                      onChange_edge_buffer={this.handle_edge_buffer}
                      edge_buffer={this.state.edge_buffer}
                      corner_buffer={this.state.corner_buffer}
                      cur_setting={this.props.cur_setting}
                    />
                  </Tab>
                  <Tab eventKey="second" title="letter scheme">
                    <SettingLetterScheme
                      letter_pair_dict={this.state.letter_pair_dict}
                      onChange_letter_pair_dict={this.handle_letter_pair_dict}
                    />
                  </Tab>
                </Tabs>
              </div>
            </div>
          </Collapse>{" "}
        </div>
      </React.Fragment>
    );
  }
}

export default Setting;
