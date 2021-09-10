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
  constructor(props) {
    super(props);
    this.state = {
      setting_save_statue : "",
      import_setting: {},
      setting_save: {},
      parse_with_letter_pair: true,
      gen_with_move_count: true,
      edge_buffer: "UF",
      corner_buffer: "UFR",
      GEN_PARSED_TO_CUBEDB : true,
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
  }
  componentDidMount() {
    this.handle_save_setting();
  }

  handle_move_count_change = (event) => {
    this.setState({ gen_with_move_count: event.target.checked });
    this.setState({setting_save_statue : " - Changes unsaved"})

  };
  handle_apply_letter_pairs_change = (event) => {
    this.setState({ parse_with_letter_pair: event.target.checked });
    this.setState({setting_save_statue : " - Changes unsaved"})

  };
  handle_corner_buffer = (event) => {
    this.setState({ corner_buffer: event.target.value });
    this.setState({setting_save_statue : " - Changes unsaved"})

  };
  handle_edge_buffer = (event) => {
    this.setState({ edge_buffer: event.target.value });
    this.setState({setting_save_statue : " - Changes unsaved"})

  };

  handle_letter_pair_dict = (event) => {
    const letter_pair_dict_new = { ...this.state.letter_pair_dict };
    letter_pair_dict_new[event.target.id] = event.target.value;
    this.setState({ letter_pair_dict: letter_pair_dict_new });
    this.setState({setting_save_statue : " - Changes unsaved"})

  };

  handle_save_setting = () => {
    const setting = {
      EDGES_BUFFER: this.state.edge_buffer,
      CORNER_BUFFER: this.state.corner_buffer,
      PARSE_TO_LETTER_PAIR: this.state.parse_with_letter_pair,
      GEN_WITH_MOVE_COUNT: this.state.gen_with_move_count,
      GEN_PARSED_TO_CUBEDB : this.state.GEN_PARSED_TO_CUBEDB,
      LETTER_PAIRS_DICT: JSON.stringify(this.state.letter_pair_dict),
    };
    this.setState({ setting_save: setting });
    this.props.export_setting(setting);
    this.setState({setting_save_statue : ""})
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
  handle_cubedb_txt = (event) =>{
    this.setState({ GEN_PARSED_TO_CUBEDB: event.target.checked });
    this.setState({setting_save_statue : " - Changes unsaved"})
  }
  render() {
    
    return (
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header><div className="fw-bold primary">Settings {this.state.setting_save_statue}</div></Accordion.Header>
          <Accordion.Body>
            <div>
              <Tabs defaultActiveKey="first">
                <Tab eventKey="first" title="General">
                  <SettingGeneral
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
                  />
                </Tab>
                <Tab eventKey="second" title="letter scheme">
                  <SettingLetterScheme
                    letter_pair_dict={this.state.letter_pair_dict}
                    onChange_letter_pair_dict={this.handle_letter_pair_dict}
                  />
                </Tab>
                <Tab eventKey="third" title="Import setting">
                  <div className="container">
                    <div className="row">
                      <div className="col-sm">
                        <button
                          className="btn btn-primary btn-sm m-2"
                          onClick={this.handle_import_onClick}
                        >
                          Import!
                        </button>
                        <span>
                          Paste the setting you saved here and then click
                          "Import!"
                        </span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-2">
                        <input
                          onChange={this.handle_import_onChange}
                          type="text"
                          className="text m-2"
                        />
                      </div>
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="forth" title="Save Setting">
                  <div className="container">
                    <div className="row">
                      <div className="col-sm m-2">
                        <div
                          className="btn-toolbar"
                          role="group"
                          aria-label="Basic example"
                        >
                          <button
                            onClick={this.handle_save_setting}
                            className="btn btn-primary btn-sm-2 m-1"
                          >
                            Save Settings
                          </button>
                          <button
                            className="btn btn-primary m-1"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                JSON.stringify(this.state.setting_save)
                              )
                            }
                          >
                            Copy!
                          </button>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm m-1">
                          <span className="fw-bold">
                            Click "Save Settings" ={">"} "Copy!" and paste
                            output to a .txt file, next time paste it in the
                            "Import Setting" section
                          </span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm m-2">
                          <p className="text-break" styles="flexShrink: 1">
                            {JSON.stringify(this.state.setting_save)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
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
