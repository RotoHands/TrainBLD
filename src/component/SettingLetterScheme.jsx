import React, { Component } from "react";

class SettingLetterScheme extends React.Component {
  render_all_letter_pairs = () => {
    const letter_pair_dict = this.props.letter_pair_dict;
    const corners = Object.keys(letter_pair_dict)
      .filter((key) => key.length === 3)
      .reduce((obj, key) => {
        obj[key] = letter_pair_dict[key];
        return obj;
      }, {});

    const edges = Object.keys(letter_pair_dict)
      .filter((key) => key.length === 2)
      .reduce((obj, key) => {
        obj[key] = letter_pair_dict[key];
        return obj;
      }, {});

    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            {" "}
            <div className="col-6">
              <div>{this.render_letter_pair_dict(corners)}</div>
            </div>
            <div className="col-6">
              <div>{this.render_letter_pair_dict(edges)}</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };
  render_letter_pair_dict = (letter_pairs_dict) => {
    return (
      <React.Fragment>
        <div className="container">
          {Object.entries(letter_pairs_dict).map(([key, value]) => (
            <div key={key} className="row m-1">
              <div className="col-sm-2">
                <label className="m-1">{key}</label>
              </div>
              <div className="col-sm-3">
                <input
                  type="text"
                  className="form-control"
                  id={key}
                  defaultValue={value}
                  onChange={this.props.onChange_letter_pair_dict}
                />
              </div>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  };
  render() {
    return (
      <React.Fragment>
        <div>{this.render_all_letter_pairs()}</div>
      </React.Fragment>
    );
  }
}

export default SettingLetterScheme;
