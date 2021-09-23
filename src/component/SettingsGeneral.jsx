import React, { Component } from "react";
class SettingGeneral extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="gen_with_move_count"
                onChange={this.props.onChange_move_count}
                defaultChecked="true"
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
                defaultChecked="true"
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
          </div>{" "}
        </div>
      </React.Fragment>
    );
  }
}

export default SettingGeneral;
