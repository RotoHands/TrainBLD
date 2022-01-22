// based on https://codesandbox.io/s/31rvox7ojm Patryk Mazurkiewicz patmaz
import React, { Component } from "react";
import { ScrambleDisplay } from "scramble-display";

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      start_time: null,
      update_ref: null,
      ready_state: "",
      running: false,
      currentTimeMs: 0,
      currentTimeSec: 0,
      currentTimeMin: 0,
    };
  }

  formatTime = (val, ...rest) => {
    let value = val.toString();
    if (value.length < 2) {
      value = "0" + value;
    }

    if (rest[0] === "ms" && value.length == 3) {
      value = value.slice(0, 2);
    }
    return value;
  };

  start = () => {
    if (!this.state.running) {
      this.setState({ start_time: Date.now() });
      this.setState({ update_ref: Date.now() });
      this.setState({ running: true });
      this.watch = setInterval(() => this.pace(), 10);
    }
  };

  stop = () => {
    this.setState({ running: false });
    clearInterval(this.watch);
    this.pace();
  };

  pace = () => {
    const diff = Date.now() - this.state.start_time;
    this.setState({ currentTimeMs: diff % 1000 });
    this.setState({ update_ref: Date.now() });
    this.setState({ currentTimeSec: Math.floor(diff / 1000) % 60 });
    this.setState({ currentTimeMin: Math.floor(diff / 1000 / 60) });
  };

  reset = () => {
    this.setState({
      currentTimeMs: 0,
      currentTimeSec: 0,
      currentTimeMin: 0,
    });
  };
  handle_key_press_up = (event) => {
    if (this.state.ready_state === "text-success" && event.key === " ") {
      this.reset();
      this.start();
      this.props.onStart(Date.now());
    }
  };

  handle_key_press_down = (event) => {
    if (
      !this.state.running &&
      event.key === " " &&
      this.state.ready_state != "text-success"
    ) {
      this.setState({ ready_state: "text-success" });
    }
    if (
      this.state.running &&
      event.key === " " &&
      this.state.ready_state == "text-success"
    ) {
      this.setState({ ready_state: "" });
      this.stop();
      this.props.onStop(this.state.update_ref);
    }
  };
  // componentDidUpdate() {
  // document.getElementById('timer_element_2').focus();
  // }
  render() {
    return (
      <div
        id="timer_element_2"
        style={{
          border: "none",
          backgroundColor: "transparent",
          resize: "none",
          outline: "none",
        }}
        tabIndex="0"
        onKeyUp={this.handle_key_press_up}
        onKeyDown={this.handle_key_press_down}
      >
        <div className="row">
          <div className="col-12">
            <div class="solve_status">
              {this.props.solve_status}
            </div>
          </div>
        </div>
        <div className="row ">
          <div className="col-8 text-start timer_on_screen">
            {this.formatTime(this.state.currentTimeMin)}:
            {this.formatTime(this.state.currentTimeSec)}.
            {this.formatTime(this.state.currentTimeMs, "ms")}
          </div>
          <div className="col-3 ms-5">
            <scramble-display
              class="scramble_image"
              scramble={this.props.scramble}
            ></scramble-display>
          </div>
        </div>
      </div>
    );
  }
}

export default Timer;
