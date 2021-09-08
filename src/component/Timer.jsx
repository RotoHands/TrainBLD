// based on https://codesandbox.io/s/31rvox7ojm Patryk Mazurkiewicz patmaz
import React, { Component } from "react";

class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      this.setState({ running: true });
      this.watch = setInterval(() => this.pace(), 10);
    }
  };

  stop = () => {
    this.setState({ running: false });
    clearInterval(this.watch);
  };

  pace = () => {
    this.setState({ currentTimeMs: this.state.currentTimeMs + 10 });
    if (this.state.currentTimeMs >= 1000) {
      this.setState({ currentTimeSec: this.state.currentTimeSec + 1 });
      this.setState({ currentTimeMs: 0 });
    }
    if (this.state.currentTimeSec >= 60) {
      this.setState({ currentTimeMin: this.state.currentTimeMin + 1 });
      this.setState({ currentTimeSec: 0 });
    }
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
    }
  };

  render() {
    return (
      <div
        onKeyUp={this.handle_key_press_up}
        onKeyDown={this.handle_key_press_down}
        tabIndex="0"
      >
        <div className="">
          <span className={this.state.ready_state}>Ready</span>
          <span>
            {this.formatTime(this.state.currentTimeMin)}:
            {this.formatTime(this.state.currentTimeSec)}:
            {this.formatTime(this.state.currentTimeMs, "ms")}
          </span>
        </div>
      </div>
    );
  }
}

export default Timer;
