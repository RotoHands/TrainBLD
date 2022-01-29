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
      pressKeyTimeCount: null,
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

  handle_touch_press_up = (event) => {
    var current_time = Date.now();
    console.log(current_time - this.state.pressKeyTimeCount);
    if (current_time - this.state.pressKeyTimeCount > 150) {
      if (this.state.ready_state === "text-success") {
        this.reset();
        this.start();
        this.props.onStart(Date.now());
      }
    } else {
      this.setState({ ready_state: "" });
      this.setState({ pressKeyTimeCount: null });
    }
  };

  handle_touch_press_down = (event) => {
    if (this.state.pressKeyTimeCount == null) {
      console.log("here");
      this.setState({ pressKeyTimeCount: Date.now() });
    }
    if (!this.state.running && this.state.ready_state != "text-success") {
      this.setState({ ready_state: "text-success" });
    }
    if (this.state.running && this.state.ready_state == "text-success") {
      this.setState({ pressKeyTimeCount: null });
      this.setState({ ready_state: "" });
      this.stop();
      this.props.onStop(this.state.update_ref);
    }
  };
  handle_key_press_up = (event) => {
    var current_time = Date.now();

    if (current_time - this.state.pressKeyTimeCount > 300) {
      if (this.state.ready_state === "text-success" && event.key === " ") {
        this.reset();
        this.start();
        this.props.onStart(Date.now());
      }
    } else {
      this.setState({ ready_state: "" });
      this.setState({ pressKeyTimeCount: null });
    }
  };
  handle_key_press_down = (event) => {
    var cur_diff;
    if (this.state.pressKeyTimeCount == null) {
      this.setState({ pressKeyTimeCount: Date.now() });
      cur_diff = 0;
    } else {
      var cur_diff = Date.now() - this.state.pressKeyTimeCount;
    }
    if (
      !this.state.running &&
      event.key === " " &&
      this.state.ready_state != "text-success"
    ) {
      this.setState({ ready_state: "text-info" });
    }

    if (
      !this.state.running &&
      event.key === " " &&
      this.state.ready_state != "text-success" &&
      cur_diff > 300
    ) {
      this.setState({ ready_state: "text-success" });
    }
    if (
      this.state.running &&
      event.key === " " &&
      this.state.ready_state == "text-success"
    ) {
      this.setState({ pressKeyTimeCount: null });
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
        onTouchStart={this.handle_touch_press_down}
        onTouchEnd={this.handle_touch_press_up}
      >
        <div className="row">
          <div className="col-12">
            <div className={this.state.ready_state}>
              <div class="solve_status">{this.props.solve_status}</div>
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
