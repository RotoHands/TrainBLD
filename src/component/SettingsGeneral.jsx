import React, { Component } from "react";
class SettingGeneral extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cur_setting: this.props.cur_setting,
    };
  }
  componentDidMount = () => {};
  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <button
              onClick={this.props.handle_save_setting}
              className="btn btn-primary btn-sm-2 mt-2 me-1"
              style={{ width: 140 }}
            >
              Save Settings
            </button>
            <button
              onClick={this.props.handle_reset_setting}
              className="btn btn-primary btn-sm-2 mt-2 me-1"
              style={{ width: 140 }}
            >
              Reset Settings
            </button>
          </div>
          <div className="row">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="gen_with_move_count"
                onChange={this.props.onChange_move_count}
                defaultChecked={
                  this.props.cur_setting["GEN_WITH_MOVE_COUNT"] ? "true" : ""
                }
              />
              <label className="form-check-label">
                <span> generate with move count </span>
              </label>
            </div>{" "}
          </div>
          <div className="row">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="apply_letter_pairs"
                onChange={this.props.onChange_apply_letter_pair}
                defaultChecked={
                  this.props.cur_setting["PARSE_TO_LETTER_PAIR"] ? "true" : ""
                }
              />
              <label className="form-check-label">
                <span className="">apply letter pairs </span>
              </label>
            </div>
          </div>{" "}
          <div className="row"></div>
          <div className="row mb-2">
            <div className="col-sm-3">
              <div>
                <span className="m-2">edge buffer </span>
                <select
                  id="edge_buffer"
                  className="form-select ml-2"
                  aria-label="Default select example"
                  defaultValue={this.props.cur_setting["EDGES_BUFFER"]}
                  onChange={this.props.onChange_edge_buffer}
                >
                  <option value="UF">UF</option>
                  <option value="UB">UB</option>
                  <option value="UR">UR</option>
                  <option value="UL">UL</option>
                  <option value="LU">LU</option>
                  <option value="LF">LF</option>
                  <option value="LD">LD</option>
                  <option value="LB">LB</option>
                  <option value="FU">FU</option>
                  <option value="FR">FR</option>
                  <option value="FD">FD</option>
                  <option value="FL">FL</option>
                  <option value="RU">RU</option>
                  <option value="RB">RB</option>
                  <option value="RD">RD</option>
                  <option value="RF">RF</option>
                  <option value="BU">BU</option>
                  <option value="BL">BL</option>
                  <option value="BD">BD</option>
                  <option value="BR">BR</option>
                  <option value="DF">DF</option>
                  <option value="DR">DR</option>
                  <option value="DB">DB</option>
                  <option value="DL">DL</option>
                </select>
              </div>
            </div>
            <div className="col-sm-3">
              <div>
                <span className="m-2">corner buffer </span>
                <select
                  id="corner_buffer"
                  className="form-select"
                  aria-label="Default select example"
                  onChange={this.props.onChange_corner_buffer}
                  defaultValue={this.props.cur_setting["CORNER_BUFFER"]}
                >
                  <option value="UFR">UFR</option>
                  <option value="UBL">UBL</option>
                  <option value="UBR">UBR</option>
                  <option value="UFL">UFL</option>
                  <option value="LBU">LBU</option>
                  <option value="LFU">LFU</option>
                  <option value="LFD">LFD</option>
                  <option value="LDB">LDB</option>
                  <option value="FUL">FUL</option>
                  <option value="FUR">FUR</option>
                  <option value="FRD">FRD</option>
                  <option value="FDL">FDL</option>
                  <option value="RFU">RFU</option>
                  <option value="RBU">RBU</option>
                  <option value="RBD">RBD</option>
                  <option value="RFD">RFD</option>
                  <option value="BUR">BUR</option>
                  <option value="BUL">BUL</option>
                  <option value="BLD">BLD</option>
                  <option value="BRD">BRD</option>
                  <option value="DFL">DFL</option>
                  <option value="DFR">DFR</option>
                  <option value="DBR">DBR</option>
                  <option value="DBL">DBL</option>
                </select>
              </div>
            </div>
            <div className="col-sm-3">
              <div>
                <span className="m-2"> cube orientation (up-front) </span>
                <select
                  id="cube_oreintation"
                  className="form-select"
                  aria-label="Default select example"
                  onChange={this.props.onChange_cube_oreintation}
                  defaultValue={this.props.cur_setting["CUBE_OREINTATION"]}
                >
                  <option value="white-green">white-green</option>
                  <option value="white-yellow">white-yellow</option>
                  <option value="white-blue">white-blue</option>
                  <option value="white-orange">white-orange</option>
                  <option value="white-red">white-red</option>
                  <option value="green-white">green-white</option>
                  <option value="green-yellow">green-yellow</option>
                  <option value="green-blue">green-blue</option>
                  <option value="green-orange">green-orange</option>
                  <option value="green-red">green-red</option>
                  <option value="yellow-white">yellow-white</option>
                  <option value="yellow-green">yellow-green</option>
                  <option value="yellow-blue">yellow-blue</option>
                  <option value="yellow-orange">yellow-orange</option>
                  <option value="yellow-red">yellow-red</option>
                  <option value="blue-white">blue-white</option>
                  <option value="blue-green">blue-green</option>
                  <option value="blue-yellow">blue-yellow</option>
                  <option value="blue-orange">blue-orange</option>
                  <option value="blue-red">blue-red</option>
                  <option value="orange-white">orange-white</option>
                  <option value="orange-green">orange-green</option>
                  <option value="orange-yellow">orange-yellow</option>
                  <option value="orange-blue">orange-blue</option>
                  <option value="orange-red">orange-red</option>
                  <option value="red-white">red-white</option>
                  <option value="red-green">red-green</option>
                  <option value="red-yellow">red-yellow</option>
                  <option value="red-blue">red-blue</option>
                  <option value="red-orange">red-orange</option>
                </select>
              </div>
            </div>
          </div>{" "}
        </div>
      </React.Fragment>
    );
  }
}

export default SettingGeneral;
