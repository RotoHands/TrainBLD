import React from "react";
import * as SRScrambler from "sr-scrambler";
import cubeSolver from "cube-solver";
import ConnectCube from "./component/ConnectCube";
import Setting from "./component/Settings";
import "bootstrap/dist/css/bootstrap.css";
import Scrambler from "./component/Scrambler";
import Timer from "./component/Timer";
import { Helmet } from "react-helmet";
import logo from "./images/logo2.png";

import LZString from "lz-string";
import SolveStats from "./component/SolveStats";
import "react-base-table/styles.css";
class App extends React.Component {
  constructor() {
    super();
    this.GiikerCube = this.GiikerCube.bind(this);
    this.state = {
      gan: false,
      url_stats: "",
      averages: {
        best: { time: 10000, solve: {} },
        current: "",
        mo3: "",
        ao5: "",
        ao12: "",
        bmo3: { time: 10000, solves: {}, num: 0 },
        bao5: { time: 10000, solves: {}, num: 0 },
        bao12: { time: 10000, solves: {}, num: 0 },
        aoAll: "",
        memo: "",
        exe: "",
        fluid: "",
        success: "",
      },
      local_storage_setting: null,
      renderTable: null,
      solves_stats: [],
      timer_focus: null,
      moves_to_show: null,
      giiker_prev_moves: [],
      solve_status: "Connect Cube",
      last_scramble: null,
      scramble: null,
      parse_solve_bool: false,
      cube_moves: [],
      cube_moves_time: [],
      cube: null,
      generated_setting: "",
      timeStart: null,
      timeFinish: null,
      parsed_solve: null,
      parsed_solve_txt: null,
      parsed_solve_cubedb: null,
      parse_settings:
        localStorage.getItem("setting") === null
          ? {
              ID: this.makeid(10),
              DATE_SOLVE: "9/18/2021, 12:22 AM",
              DIFF_BETWEEN_ALGS: "0.87",
              MEMO: "1.39",
              TIME_SOLVE: "30.48",
              NAME_OF_SOLVE: "example_smart_cube",
              GEN_PARSED_TO_CUBEDB: true,
              GEN_PARSED_TO_TXT: true,
              SMART_CUBE: true,
              COMMS_UNPARSED: false,
              EDGES_BUFFER: "UF",
              CORNER_BUFFER: "UFR",
              CUBE_OREINTATION: "white-green",
              SCRAMBLE_TYPE: "3x3",
              PARSE_TO_LETTER_PAIR: true,
              GEN_WITH_MOVE_COUNT: true,
              LETTER_PAIRS_DICT:
                '{"UBL":"A","UBR":"B","UFR":"C","UFL":"D","LBU":"E","LFU":"F","LFD":"G","LDB":"H","FUL":"I","FUR":"J","FRD":"K","FDL":"L","RFU":"M","RBU":"N","RBD":"O","RFD":"P","BUR":"Q","BUL":"R","BLD":"S","BRD":"T","DFL":"U","DFR":"V","DBR":"W","DBL":"X","UB":"A","UR":"B","UF":"C","UL":"D","LU":"E","LF":"F","LD":"G","LB":"H","FU":"I","FR":"J","FD":"K","FL":"L","RU":"M","RB":"N","RD":"O","RF":"P","BU":"Q","BL":"R","BD":"S","BR":"T","DF":"U","DR":"V","DB":"W","DL":"X"}',
              SCRAMBLE:
                "F' R' B' D L' B' B' D' D' L' U B' R R F' R R B D' D' B U U L L U U L L B' R' U'",
              SOLVE:
                "R F' L' F R' L D' L D L' U' U' L' R B R B' R' L U R' U R' R' U D' F U' F' U' D R U R R' F' L F L' R U' L' U L R' R' U' R U' D B' B' U D' R U R R F' R' U D' F F D U' R' F R' D D U R U' R' D D R U R' U' R R U R' D' R' D R U U R' D' R U D U R U U' U' R' D R R U R' R' U' R R D' R' R' U R R U' R' R' R D' R' D R U R' D' R U' D R'",
              SOLVE_TIME_MOVES: [],
            }
          : JSON.parse(localStorage.getItem("setting")),
    };
  }

  componentDidMount = () => {
    this.initialStatsFromLocalstorage();
    this.handle_scramble();
  };
  componentDidUpdate = () => {
    document.getElementById("timer_element_2").focus();
  };
  convert_time_to_sec = (time) => {
    let split_time = time.split(":");
    if (split_time.length == 1) {
      return parseFloat(time);
    }
    return parseFloat(split_time[0]) * 60 + parseFloat(split_time[1]);
  };
  convert_sec_to_format = (time) => {
    if (typeof time == "string") {
      return time;
    }
    let time_str;
    let minute = Math.floor(time / 60);
    let sec = (time - minute * 60).toFixed(2);
    if (minute != 0) {
      if (sec < 10) {
        time_str = `${minute}:0${sec}`;
      } else {
        time_str = `${minute}:${sec}`;
      }
    } else {
      time_str = `${sec}`;
    }
    return time_str;
  };

  calc_average = (arr) => {
    let average;
    let dnf_arr = arr.map(({ DNF }) => DNF);
    let times_arr = arr
      .map(({ time_solve }) => time_solve)
      .map((x) => parseFloat(x));

    const sum = (previousValue, currentValue) => previousValue + currentValue;

    if (dnf_arr.filter((x) => x === true).length >= 2) {
      average = "DNF";
      return average;
    }
    if (dnf_arr.filter((x) => x === true).length === 1) {
      times_arr.splice(dnf_arr.indexOf(true), 1);
      times_arr.splice(times_arr.indexOf(Math.min(...times_arr)), 1);
      average = parseFloat(
        (times_arr.reduce(sum) / times_arr.length).toFixed(2)
      );
    } else {
      times_arr.splice(times_arr.indexOf(Math.min(...times_arr)), 1);
      times_arr.splice(times_arr.indexOf(Math.max(...times_arr)), 1);
      average = parseFloat(
        (times_arr.reduce(sum) / times_arr.length).toFixed(2)
      );
    }
    return average;
  };
  calc_mo3 = (arr) => {
    let mo3 = 0;
    let len = arr.length;
    let mo3_arr = arr.slice(len - 3, len);
    for (var i = 0; i < 3; i++) {
      if (mo3_arr[i]["DNF"] === true) {
        mo3 = "DNF";
        return mo3;
      } else {
        mo3 += parseFloat(mo3_arr[i]["time_solve"]);
      }
    }
    mo3 = parseFloat((mo3 / 3).toFixed(2));
    return mo3;
  };

  initialAveragesNoSolves = () => {
    let averages = {
      best: { time: 10000, solve: {} },
      mo3: "",
      ao5: "",
      ao12: "",
      bmo3: { time: 10000, solves: {}, num: 0 },
      bao5: { time: 10000, solves: {}, num: 0 },
      bao12: { time: 10000, solves: {}, num: 0 },
      aoAll: "",
      memo: "",
      exe: "",
      fluid: "",
      success: "",
    };
    localStorage.setItem("averages", JSON.stringify(averages));
    this.setState({ averages: averages });
  };
  initialAverages = () => {
    const sum = (previousValue, currentValue) => previousValue + currentValue;

    if (localStorage.getItem("averages") === null) {
      this.initialAveragesNoSolves();
    } else {
      let averages = JSON.parse(localStorage.getItem("averages"));
      let mo3, ao5, ao12, succcess, aoAll, current, memo, exe, fluid;
      let solve_stats = JSON.parse(localStorage.getItem("solves"));
      let len = solve_stats.length;
      mo3 = solve_stats.length >= 3 ? this.calc_mo3(solve_stats) : "";
      ao5 =
        solve_stats.length >= 5
          ? this.calc_average(solve_stats.slice(len - 5, len))
          : "";
      ao12 =
        solve_stats.length >= 12
          ? this.calc_average(solve_stats.slice(len - 12, len))
          : "";
      if (solve_stats.length > 0) {
        let time = solve_stats[solve_stats.length - 1]["time_solve"];
        if (solve_stats[solve_stats.length - 1]["DNF"] === true) {
          current = "DNF(" + this.convert_sec_to_format(time) + ")";
        } else {
          current = time;
        }
      }

      if (
        [...solve_stats].map(({ DNF }) => DNF).filter((x) => x === false)
          .length > 0
      ) {
        aoAll = [...solve_stats]
          .filter(function ({ DNF, time_solve }) {
            if (DNF === false) {
              return parseFloat(time_solve);
            }
          })
          .map(({ time_solve }) => parseFloat(time_solve));
        aoAll = parseFloat((aoAll.reduce(sum) / aoAll.length).toFixed(2));
        succcess = `${
          [...solve_stats].map(({ DNF }) => DNF).filter((x) => x === false)
            .length
        }/${[...solve_stats].length}`;
        memo = [...solve_stats]
          .filter(function ({ DNF, memo_time }) {
            if (DNF === false) {
              return parseFloat(memo_time);
            }
          })
          .map(({ memo_time }) => parseFloat(memo_time));
        memo = parseFloat((memo.reduce(sum) / memo.length).toFixed(2));

        exe = [...solve_stats]
          .filter(function ({ DNF, exe_time }) {
            if (DNF === false) {
              return parseFloat(exe_time);
            }
          })
          .map(({ exe_time }) => parseFloat(exe_time));
        exe = parseFloat((exe.reduce(sum) / exe.length).toFixed(2));

        fluid = [...solve_stats]
          .filter(function ({ DNF, fluidness }) {
            if (DNF === false) {
              return parseFloat(fluidness);
            }
          })
          .map(({ fluidness }) => parseFloat(fluidness));
        fluid = parseFloat((fluid.reduce(sum) / fluid.length).toFixed(2));
        averages["current"] = current;
        averages["mo3"] = mo3;
        averages["ao5"] = ao5;
        averages["ao12"] = ao12;
        averages["aoAll"] = aoAll;
        averages["memo"] = memo;
        averages["exe"] = exe;
        averages["fluid"] = fluid;
        averages["success"] = succcess;

        localStorage.setItem("averages", JSON.stringify(averages));
        this.setState({ averages: averages });
      } else {
        this.initialAveragesNoSolves();
      }
    }
  };
  plus_two_last_solve = () => {
    let solve_stats = [...this.state.solves_stats];
    let num_solve = solve_stats.length - 1;
    solve_stats[num_solve]["time_solve"] =
      parseFloat(solve_stats[num_solve]["time_solve"]) + 2;
    solve_stats[num_solve]["exe_time"] =
      parseFloat(solve_stats[num_solve]["exe_time"]) + 2;
    localStorage.setItem("solves", JSON.stringify(solve_stats));

    this.initialStatsFromLocalstorage();
    this.calc_best_average_after_delete();
  };

  delete_solve = (num_solve) => {
    let solve_stats = [...this.state.solves_stats];
    num_solve = solve_stats.length - num_solve - 1;
    if (window.confirm("Are you sure you want to delete the solve?")) {
      solve_stats.splice(num_solve, 1);
      localStorage.setItem("solves", JSON.stringify(solve_stats));
    }
    this.initialStatsFromLocalstorage();
    this.calc_best_average_after_delete();
  };
  dnf_last_solve = () => {
    let solve_stats = [...this.state.solves_stats];
    let num_solve = solve_stats.length - 1;

    solve_stats[num_solve]["DNF"] = !solve_stats[num_solve]["DNF"];
    localStorage.setItem("solves", JSON.stringify(solve_stats));

    this.initialStatsFromLocalstorage();
    this.calc_best_average_after_delete();
  };

  delete_last_solve = () => {
    let solve_stats = [...this.state.solves_stats];
    let num_solve = solve_stats.length - 1;
    if (window.confirm("Are you sure you want to delete last solve?")) {
      solve_stats.splice(num_solve, 1);
      localStorage.setItem("solves", JSON.stringify(solve_stats));
    }
    this.initialStatsFromLocalstorage();
    this.calc_best_average_after_delete();
  };
  renderTableData = (solve_stats) => {
    let header_elem = (
      <React.Fragment>
        <th key="num">#</th>
        <th key="time">time</th>
        <th key="memo">memo</th>
        {/* <th key="exe">exe</th> */}
        <th key="fluidness">fluid</th>
        <th key="link">link</th>
      </React.Fragment>
    );
    let len = solve_stats.length;
    solve_stats.reverse();
    let rows = solve_stats.map((solve, index) => {
      const {
        DNF,
        exe_time,
        fluidness,
        link,
        memo_time,
        date,
        time_solve,
        txt_solve,
      } = solve; //destructuring
      return (
        <tr key={date}>
          <td>
            <a
              href="#"
              title="delete solve"
              value={index}
              onClick={() => this.delete_solve(index)}
            >
              <div>{len - index}</div>
            </a>
          </td>
          <td>
            {DNF
              ? "DNF(" + this.convert_sec_to_format(time_solve) + ")"
              : this.convert_sec_to_format(time_solve)}{" "}
          </td>
          <td>{this.convert_sec_to_format(memo_time)}</td>
          {/* <td>{exe_time}</td> */}
          <td>
            {!DNF ? fluidness : ""}
            {fluidness && !DNF ? "%" : ""}
          </td>
          <td>
            <a href={link} target="_blank" title={txt_solve}>
              <div>link</div>
            </a>
          </td>
        </tr>
      );
    });
    solve_stats.reverse();
    let new_table = (
      <React.Fragment>
        <tr>{header_elem}</tr>
        {rows}
      </React.Fragment>
    );

    this.setState({ renderTable: new_table });
  };
  generateCsvURL = (solve_stats, averages) => {
    let copy_solve_stats = [...solve_stats];
    copy_solve_stats = [...copy_solve_stats].map(function (x) {
      let obj;
      obj = { ...x };
      obj["date"] = new Date(x["date"]);
      return obj;
    });
    let items = copy_solve_stats;
    const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    let header = Object.keys(items[0]);
    const csv_solves = [
      header.join(","), // header row first
      ...items.map((row) =>
        header
          .map((fieldName) => JSON.stringify(row[fieldName], replacer))
          .join(",")
      ),
    ].join("\r\n");
    items = averages;
    header = Object.keys(items);
    items = Object.values(items);
    items = [...items].map(function (x) {
      if (typeof x === "object") {
        let obj = x["time"];
        return obj;
      }
      return x;
    });

    const csv_averages = [header.join(","), [...items].join(",")].join("\r\n");

    const all = csv_averages + "\r\n\r\n" + csv_solves;
    var data = new Blob([all], { type: "text/csv" });
    let url_csv = window.URL.createObjectURL(data);
    return url_csv;
  };
  calc_best_average = () => {
    let solve_stats = JSON.parse(localStorage.getItem("solves"));
    let cur_averages = JSON.parse(localStorage.getItem("averages"));
    if (cur_averages["mo3"] != "" && cur_averages["mo3"] != "DNF") {
      if (cur_averages["mo3"] < cur_averages["bmo3"]["time"]) {
        cur_averages["bmo3"]["time"] = cur_averages["mo3"];
        cur_averages["bmo3"]["num"] = solve_stats.length - 2;

        cur_averages["bmo3"]["solves"] = solve_stats.slice(
          solve_stats.length - 3,
          solve_stats.length
        );
      }
    }

    if (cur_averages["ao5"] != "" && cur_averages["ao5"] != "DNF") {
      if (cur_averages["ao5"] < cur_averages["bao5"]["time"]) {
        cur_averages["bao5"]["time"] = cur_averages["ao5"];
        cur_averages["bao5"]["num"] = solve_stats.length - 4;
        cur_averages["bao5"]["solves"] = solve_stats.slice(
          solve_stats.length - 5,
          solve_stats.length
        );
      }
    }
    if (cur_averages["ao12"] != "" && cur_averages["ao12"] != "DNF") {
      if (cur_averages["ao12"] < cur_averages["bao12"]["time"]) {
        cur_averages["bao12"]["time"] = cur_averages["ao12"];
        cur_averages["bao12"]["num"] = solve_stats.length - 11;

        cur_averages["bao12"]["solves"] = solve_stats.slice(
          solve_stats.length - 12,
          solve_stats.length
        );
      }
    }
    if (solve_stats.length > 0) {
      console.log("heree");
      console.log(solve_stats[solve_stats.length - 1]);
      if (
        solve_stats[solve_stats.length - 1] != "" &&
        solve_stats[solve_stats.length - 1]["DNF"] !== true
      ) {
        if (
          solve_stats[solve_stats.length - 1]["time_solve"] <
          cur_averages["best"]["time"]
        ) {
          cur_averages["best"]["time"] =
            solve_stats[solve_stats.length - 1]["time_solve"];
          cur_averages["best"]["num"] = solve_stats.length;

          cur_averages["best"]["solve"] = solve_stats[solve_stats.length - 1];
        }
      }
    }
    localStorage.setItem("averages", JSON.stringify(cur_averages));
    this.setState({ averages: cur_averages });
  };

  calc_best_average_after_delete = () => {
    let solve_stats = JSON.parse(localStorage.getItem("solves"));
    let cur_averages = JSON.parse(localStorage.getItem("averages"));
    let cur = { best: 10000, mo3: 10000, ao5: 10000, ao12: 10000 };
    let best = {
      best: { time: 10000, num: 0, solve: {} },
      mo3: { time: 10000, num: 0, solves: {} },
      ao5: { time: 10000, num: 0, solves: {} },
      ao12: { time: 10000, num: 0, solves: {} },
    };

    let len = solve_stats.length;
    for (var i = 0; i < solve_stats.length; i++) {
      if (i + 1 <= len) {
        cur["best"] = solve_stats[i]["time_solve"];
        console.log(solve_stats[i]);
        if (cur["best"] < best["best"]["time"] && !solve_stats[i]["DNF"]) {
          best["best"]["time"] = parseFloat(cur["best"]);
          best["best"]["num"] = i;
          best["best"]["solve"] = solve_stats[i];
        }
      }

      if (i + 3 <= len) {
        cur["mo3"] = this.calc_mo3(solve_stats.slice(i, i + 3));
        if (cur["mo3"] < best["mo3"]["time"]) {
          best["mo3"]["time"] = cur["mo3"];
          best["mo3"]["num"] = i;
          best["mo3"]["solves"] = solve_stats.slice(i, i + 3);
        }
      }

      if (i + 5 <= len) {
        cur["ao5"] = this.calc_average(solve_stats.slice(i, i + 5));
        if (cur["ao5"] < best["ao5"]["time"]) {
          best["ao5"]["time"] = cur["ao5"];
          best["ao5"]["num"] = i;
          best["ao5"]["solves"] = solve_stats.slice(i, i + 5);
        }
      }

      if (i + 12 <= len) {
        cur["ao12"] = this.calc_average(solve_stats.slice(i, i + 12));
        if (cur["ao12"] < best["ao12"]["time"]) {
          best["ao12"]["time"] = cur["ao12"];
          best["ao12"]["num"] = i;
          best["ao12"]["solves"] = solve_stats.slice(i, i + 12);
        }
      }
    }
    cur_averages["best"] = best["best"];
    cur_averages["bmo3"] = best["mo3"];
    cur_averages["bao5"] = best["ao5"];
    cur_averages["bao12"] = best["ao12"];
    localStorage.setItem("averages", JSON.stringify(cur_averages));
    this.setState({ averages: cur_averages });
  };

  initialStatsFromLocalstorage = () => {
    let solve_stats = [];
    if (localStorage.getItem("solves") === null) {
      localStorage.setItem("solves", JSON.stringify([]));
    } else {
      solve_stats = JSON.parse(localStorage.getItem("solves"));
      if (solve_stats.length > 0) {
        let url_csv = this.generateCsvURL(
          solve_stats,
          JSON.parse(localStorage.getItem("averages"))
        );
        this.setState({ url_stats: url_csv }, () => {});
      }
    }
    this.setState({ solves_stats: solve_stats });
    this.renderTableData(solve_stats);
    this.initialAverages();
    this.calc_best_average();
  };
  addSolveToLocalStorage = (data) => {
    var rgx = /[0-9]+:?[0-9]*\.[0-9]*/g;
    let solve_txt = data["txt"];
    let times_str = solve_txt.split("\n")[0];
    let times = [...times_str.match(rgx)];
    let new_solve_stats = [...this.state.solves_stats];

    let solve_stats = {
      date: Date.now(),
      time_solve: this.convert_time_to_sec(times[0]),
      memo_time: this.convert_time_to_sec(times[1]),
      exe_time: this.convert_time_to_sec(times[2]),
      txt_solve: data["txt"],
      link: data["cubedb"],
    };
    if (!times_str.toLowerCase().includes("dnf")) {
      solve_stats["fluidness"] = times[3];
      solve_stats["DNF"] = false;
    } else {
      solve_stats["DNF"] = true;
    }

    new_solve_stats.push(solve_stats);
    this.setState({ solves_stats: new_solve_stats });

    localStorage.setItem("solves", JSON.stringify(new_solve_stats));
    this.initialStatsFromLocalstorage();
  };
  extract_solve_from_cube_moves = (timer_finish) => {
    let parse_setting_new = { ...this.state.parse_settings };
    let scramble = [];
    let solve = [];
    let memo_time = 0;
    let solve_time = 0;
    let moves = this.state.cube_moves;
    let moves_time = this.state.cube_moves_time;
    let time_start_solve = this.state.timeStart;
    let time_end_solve = timer_finish;
    // console.log(time_end_solve - time_start_solve);

    for (let i = 0; i < moves.length; i++) {
      if (moves_time[i] < time_start_solve) {
        scramble.push(moves[i]);
      }
      if (moves_time[i] > time_start_solve && moves_time[i] < timer_finish) {
        if (memo_time === 0) {
          memo_time = (moves_time[i] - time_start_solve) / 1000;
        }
        solve.push(moves[i]);
      }
    }
    // console.log("scramble :\n", scramble.join(" "));
    // console.log("solve :\n", solve.join(" "));

    solve_time = ((time_end_solve - time_start_solve) / 1000).toFixed(2);
    parse_setting_new["SCRAMBLE"] = scramble
      .join(" ")
      .toString()
      .replace(/  +/g, " ");
    parse_setting_new["SOLVE"] = solve
      .join(" ")
      .toString()
      .replace(/  +/g, " ");
    parse_setting_new["MEMO"] = memo_time.toString();
    parse_setting_new["TIME_SOLVE"] = solve_time.toString();
    // console.log(scramble.length);
    // console.log(this.state.cube_moves_time);

    let cube_moves_time_diff = [];
    let only_solve_moves = this.state.cube_moves_time.slice(
      scramble.length,
      this.state.cube_moves_time.length
    );
    cube_moves_time_diff.push(0);
    for (var i = 0; i < only_solve_moves.length - 1; i++) {
      cube_moves_time_diff.push(
        parseFloat(
          ((only_solve_moves[i + 1] - only_solve_moves[0]) / 1000).toFixed(2)
        )
      );
    }
    // console.log(cube_moves_time_diff);

    parse_setting_new["SOLVE_TIME_MOVES"] =
      JSON.stringify(cube_moves_time_diff);
    this.setState({ parse_settings: parse_setting_new });
    return parse_setting_new;
  };

  handle_solve_status = (next_status) => {
    if (next_status === "Parsing didn't succeed") {
      this.setState({ solve_status: next_status });
    }
    if (this.state.solve_status === "Parsing didn't succeed") {
      new Promise((r) => setTimeout(r, 2000)).then(() => {
        this.setState({ solve_status: "Ready for scrambling" });
      });
    }
    if (
      this.state.solve_status === "Connect Cube" &&
      next_status === "Connecting..."
    ) {
      this.setState({ solve_status: next_status });
    }
    if (
      this.state.solve_status === "Connecting..." &&
      next_status === "Ready for scrambling"
    ) {
      this.setState({ solve_status: next_status });
    }
    if (
      this.state.solve_status === "Ready for scrambling" &&
      next_status === "Scrambling"
    ) {
      this.setState({ solve_status: next_status });
    }
    if (
      this.state.solve_status === "Scrambling" &&
      next_status === "Ready for scrambling"
    ) {
      this.setState({ solve_status: next_status });
    }
    if (this.state.solve_status === "Scrambling" && next_status === "Memo") {
      this.setState({ solve_status: next_status });
    }
    if (this.state.solve_status === "Memo" && next_status === "Solving") {
      this.setState({ solve_status: next_status });
    }
    if (this.state.solve_status === "Solving" && next_status === "Parsing...") {
      this.setState({ solve_status: next_status });
    }
    if (
      this.state.solve_status === "Parsing..." &&
      next_status === "Ready for scrambling"
    ) {
      this.setState({ solve_status: next_status });
    }
  };
  handle_onStart_timer = (timer_start) => {
    this.setState({ timeStart: timer_start });
    let parse_setting_new = { ...this.state.parse_settings };
    var options = {
      hour: "2-digit",
      minute: "2-digit",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    var today = new Date();
    parse_setting_new["DATE_SOLVE"] = today.toLocaleDateString(
      "en-US",
      options
    );
    this.setState({ parse_settings: parse_setting_new });
    this.handle_solve_status("Memo");
  };
  makeid = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  handle_onStop_timer = (timer_finish) => {
    new Promise((resolve) => setTimeout(resolve, 400))
      .then((data) => {
        if (this.state.gan === true) {
          console.log("here gan");
          timer_finish =
            this.state.cube_moves_time[this.state.cube_moves_time.length - 1] +
            1;
        }
        this.setState({ timeFinish: timer_finish });
        this.handle_solve_status("Parsing...");
        this.handle_parse_solve(timer_finish);
        this.setState({ cube_moves: [] });
        this.setState({ cube_moves_time: [] });
        this.handle_scramble();
      })
      .catch((data) => console.log(data));
  };
  handle_export_setting = (settings) => {
    let new_settings = { ...this.state.parse_settings };
    for (var key in settings) {
      if (!(key in this.state.parse_settings)) {
        if (key == "CUBE_OREINTATION") {
          new_settings[key] = settings[key];
        } else if (key == "SCRAMBLE_TYPE") {
          new_settings[key] = settings[key];
        } else {
          console.log("wrong keys : ", key);
        }
      } else {
        new_settings[key] = settings[key];
      }
      this.setState({ parse_settings: new_settings });
    }
    localStorage.setItem("setting", JSON.stringify(new_settings));
  };
  handle_reset_cube = () => {
    this.setState({ cube_moves: [] });
    this.setState({ cube_moves_time: [] });
    this.setState({ moves_to_show: "" });
    this.handle_solve_status("Ready for scrambling");
  };
  handle_parse_solve = (timer_finish) => {
    const setting = this.extract_solve_from_cube_moves(timer_finish);
    console.log(setting);
    let result;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(setting),
    };

    fetch("https://rotohands-bld-parser.herokuapp.com/", requestOptions)
      // fetch("http://127.0.0.1:8080", requestOptions)
      .then((response) =>
        response.json().then((data) => {
          result = data;
          console.log("request to parsing server");
          console.log(requestOptions);
          this.addSolveToLocalStorage(result);
          this.setState({ parsed_solve: result });
          if ("cubedb" in result) {
            this.setState({ parsed_solve_cubedb: result["cubedb"] });
            console.log(result["cubedb"]);
            // window.open(result["cubedb"]);
          }
          if ("txt" in result) {
            console.log(result["txt"]);
            this.setState({ parsed_solve_txt: result["txt"] });
          }

          this.handle_solve_status("Ready for scrambling");
        })
      )
      .catch((data) => {
        console.log(requestOptions["body"]);
        this.handle_solve_status("Parsing didn't succeed");
      });
  };
  handle_scramble = () => {
    this.setState({ last_scramble: this.state.scramble });
    this.setState({
      scramble: cubeSolver.scramble(this.state.parse_settings["SCRAMBLE_TYPE"]),
    });
  };
  handle_moves_to_show = (cube_moves) => {
    if (this.state.solve_status === "Scrambling") {
      this.setState({ moves_to_show: cube_moves.join(" ") });
    } else {
      this.setState({ moves_to_show: "" });
    }
  };
  handle_last_scramble = () => {
    this.setState({ scramble: this.state.last_scramble });
  };
  handle_reset_stats = () => {
    if (window.confirm("Are you sure you want to reset stats?")) {
      if (localStorage.getItem("solves") !== null) {
        localStorage.removeItem("solves");
      }
      this.initialStatsFromLocalstorage();
    }
  };
  desktop_layout = () => {
    const styleleft = {
      width: "245px",
    };
    return (
      <React.Fragment>
        <div className="application">
          <Helmet id="background_page"></Helmet>
        </div>
        <div class="container container_2">
          <div class="logo">
            <img
              class="logo_img"
              src={logo}
              // className="rounded mx-auto"
              alt=""
            />
          </div>
          <div class="connect_cube">
            <ConnectCube onConnect={this.GiikerCube} />
          </div>
          <div class="trainbld_header">TrainBLD</div>
          <div
            className="social btn-toolbar"
            role="group"
            aria-label="Basic example"
          >
            <button
              class="youtube btn btn-primary btn-sm m-1 text-center"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/channel/UCVGKCZFamCuYXiln9w3Cnxw"
                )
              }
            >
              Youtube
            </button>
            <button
              className="github btn btn-primary m-1 text-center "
              onClick={() => window.open("https://github.com/RotoHands")}
            >
              Github
            </button>
            <button
              className="support btn btn-primary m-1"
              onClick={() =>
                window.open(
                  "https://www.paypal.com/donate?hosted_button_id=X9X9VZEAYK3DJ"
                )
              }
            >
              Support :)
            </button>
          </div>
          <div className="rotem_ifrach">By Rotem Ifrach</div>
          <div class="setting">
            <Setting
              cur_setting={this.state.parse_settings}
              export_setting={this.handle_export_setting}
              id={this.state.parse_settings["ID"]}
            />
          </div>
          <div class="stats_bar">
            <a
              className="stats_bar_reset"
              title="delete all stats"
              onClick={this.handle_reset_stats}
              href="#"
            >
              Reset/
            </a>
            <a
              class="stats_bar_export_stats"
              href={this.state.url_stats}
              download="solves.csv"
              id="export_solves"
            >
              Export {""}
            </a>

            <a
              class="stats_bar_plus_2"
              href="#"
              title="+2 last solve"
              onClick={() => this.plus_two_last_solve()}
            >
              {"  "}
              +2/
            </a>
            <a
              class="stats_bar_dnf_last_solve"
              href="#"
              title="DNF last solve"
              onClick={() => this.dnf_last_solve()}
            >
              DNF/
            </a>
            <a
              class="stats_bar_delete_last_solve"
              href="#"
              title="delete last solve"
              value={this.state.solves_stats.length}
              onClick={() => this.delete_last_solve()}
            >
              {""}
              Delete
            </a>
          </div>
          <div class="stats">
            <table class="best_averages">
              <tbody>
                <tr>
                  <th>#</th>
                  <th>current</th>
                  <th>best</th>
                </tr>
                <tr>
                  <td>bo1</td>
                  <td>
                    {this.state.averages["current"] != null
                      ? this.convert_sec_to_format(
                          this.state.averages["current"]
                        )
                      : ""}
                  </td>
                  <td>
                    {this.state.averages["best"]["time"] != 10000
                      ? this.convert_sec_to_format(
                          this.state.averages["best"]["time"]
                        )
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td>mo3</td>
                  <td>
                    {this.state.averages["mo3"] != ""
                      ? this.convert_sec_to_format(this.state.averages["mo3"])
                      : ""}
                  </td>
                  <td>
                    {this.state.averages["bmo3"]["time"] != 10000
                      ? this.convert_sec_to_format(
                          this.state.averages["bmo3"]["time"]
                        )
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td>ao5</td>
                  <td>
                    {this.state.averages["ao5"] != ""
                      ? this.convert_sec_to_format(this.state.averages["ao5"])
                      : ""}
                  </td>
                  <td>
                    {this.state.averages["bao5"]["time"] != 10000
                      ? this.convert_sec_to_format(
                          this.state.averages["bao5"]["time"]
                        )
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td>ao12</td>
                  <td>
                    {this.state.averages["ao12"] != ""
                      ? this.convert_sec_to_format(this.state.averages["ao12"])
                      : ""}
                  </td>
                  <td>
                    {this.state.averages["bao12"]["time"] != 10000
                      ? this.convert_sec_to_format(
                          this.state.averages["bao12"]["time"]
                        )
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" style={{ whiteSpace: "pre-wrap" }}>
                    {this.convert_sec_to_format(this.state.averages["aoAll"]) +
                      "(" +
                      this.convert_sec_to_format(this.state.averages["memo"]) +
                      ", " +
                      this.convert_sec_to_format(this.state.averages["exe"]) +
                      ") " +
                      this.state.averages["fluid"] +
                      "%\t" +
                      this.state.averages["success"]}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="solve_stats">
            <SolveStats
              id="upper_page"
              renderTable={this.state.renderTable}
              solve_stats={this.state.solves_stats}
              initStats={this.initialStatsFromLocalstorage}
              renderTableData={this.renderTableData}
            />
          </div>
          <div class="scrambler">
            <Scrambler
              onReset={this.handle_reset_cube}
              scramble={this.state.scramble}
              onClick_scramble={this.handle_scramble}
              onClick_last_scramble={this.handle_last_scramble}
            />{" "}
          </div>
          <div class="timer">
            <div class="moves_scramble">{this.state.moves_to_show}</div>
            <Timer
              // parsed_solve_txt={this.state.parsed_solve_txt}
              scramble={this.state.scramble}
              solve_status={this.state.solve_status}
              onStart={(timer_start) => this.handle_onStart_timer(timer_start)}
              onStop={(timer_finish) => this.handle_onStop_timer(timer_finish)}
            />
          </div>
        </div>
      </React.Fragment>
    );
  };
  render() {
    return <React.Fragment>{this.desktop_layout()}</React.Fragment>;
  }

  GiikerCube = () => {
    const this_App = this;
    var _device = null;

    var GiikerCube = (function () {
      var _server = null;
      var _chrct = null;

      var UUID_SUFFIX = "-0000-1000-8000-00805f9b34fb";

      var SERVICE_UUID_DATA = "0000aadb" + UUID_SUFFIX;
      var CHRCT_UUID_DATA = "0000aadc" + UUID_SUFFIX;

      var SERVICE_UUID_RW = "0000aaaa" + UUID_SUFFIX;
      var CHRCT_UUID_READ = "0000aaab" + UUID_SUFFIX;
      var CHRCT_UUID_WRITE = "0000aaac" + UUID_SUFFIX;

      var deviceName;

      function init(device) {
        deviceName = device.name.startsWith("Gi") ? "Giiker" : "Mi Smart";
        return device.gatt
          .connect()
          .then(function (server) {
            this_App.handle_solve_status("Ready for scrambling");
            _server = server;
            return server.getPrimaryService(SERVICE_UUID_DATA);
          })
          .then(function (service) {
            return service.getCharacteristic(CHRCT_UUID_DATA);
          })
          .then(function (chrct) {
            _chrct = chrct;
            return _chrct.startNotifications();
          })
          .then(function () {
            return _chrct.readValue();
          })
          .then(function (value) {
            // var initState = parseState(value);
            // if (initState[0] != kernel.getProp("giiSolved", SOLVED_FACELET)) {
            // console.log("here");
            // }

            // 	var rst = kernel.getProp('giiRST');
            // if (rst == 'a' || rst == 'p' && confirm(CONFIRM_GIIRST)) {
            // giikerutil.markSolved();
            // }
            // }
            return _chrct.addEventListener(
              "characteristicvaluechanged",
              onStateChanged
            );
          });
      }

      function onStateChanged(event) {
        var value = event.target.value;
        parseState(value);
      }

      /* var cFacelet = [
        [26, 15, 29],
        [20, 8, 9],
        [18, 38, 6],
        [24, 27, 44],
        [51, 35, 17],
        [45, 11, 2],
        [47, 0, 36],
        [53, 42, 33],
      ];

      var eFacelet = [
        [25, 28],
        [23, 12],
        [19, 7],
        [21, 41],
        [32, 16],
        [5, 10],
        [3, 37],
        [30, 43],
        [52, 34],
        [48, 14],
        [46, 1],
        [50, 39],
      ];
      */
      function toHexVal(value) {
        var raw = [];
        for (var i = 0; i < 20; i++) {
          raw.push(value.getUint8(i));
        }
        if (raw[18] === 0xa7) {
          // decrypt
          var key = [
            176, 81, 104, 224, 86, 137, 237, 119, 38, 26, 193, 161, 210, 126,
            150, 81, 93, 13, 236, 249, 89, 235, 88, 24, 113, 81, 214, 131, 130,
            199, 2, 169, 39, 165, 171, 41,
          ];
          var k1 = (raw[19] >> 4) & 0xf;
          var k2 = raw[19] & 0xf;
          for (i = 0; i < 18; i++) {
            raw[i] += key[i + k1] + key[i + k2];
          }
          raw = raw.slice(0, 18);
        }
        var valhex = [];
        for (i = 0; i < raw.length; i++) {
          valhex.push((raw[i] >> 4) & 0xf);
          valhex.push(raw[i] & 0xf);
        }
        return valhex;
      }

      function parseState(value) {
        // var timestamp = Date.now();

        var valhex = toHexVal(value);
        var eo = [];
        for (var i = 0; i < 3; i++) {
          for (var mask = 8; mask !== 0; mask >>= 1) {
            eo.push(valhex[i + 28] & mask ? 1 : 0);
          }
        }

        // var cc = new mathlib.CubieCube();
        // var coMask = [-1, 1, -1, 1, 1, -1, 1, -1];
        // for (var i = 0; i < 8; i++) {
        // cc.ca[i] =
        // (valhex[i] - 1) | ((3 + valhex[i + 8] * coMask[i]) % 3 << 3);
        // }
        // for (var i = 0; i < 12; i++) {
        // cc.ea[i] = ((valhex[i + 16] - 1) << 1) | eo[i];
        // }
        // var facelet = cc.toFaceCube(cFacelet, eFacelet);

        var moves = valhex.slice(32, 40);
        var prevMoves = [];
        let new_moves = [];
        let new_moves_time = [];
        for (i = 0; i < moves.length; i += 2) {
          // console.log(
          // "BDLURF".charAt(moves[i] - 1) + " 2'".charAt((moves[i + 1] - 1) % 7)
          // );
          prevMoves.push(
            "BDLURF".charAt(moves[i] - 1) + " 2'".charAt((moves[i + 1] - 1) % 7)
          );
        }
        // prevMoves.reverse();

        if (this_App.state.giiker_prev_moves.length === 0) {
          this_App.setState({ giiker_prev_moves: prevMoves });
        } else {
          let last_moves = [...this_App.state.giiker_prev_moves];
          // console.log("last moves 1", last_moves);
          // console.log("prev_moves", prevMoves);

          for (i = 0; i < 4; i++) {
            let move = prevMoves[i];
            last_moves.unshift(move);
            // console.log("last moves", last_moves);
            // console.log("last_moves_slice", last_moves.slice(0, 4).join(" "));
            // console.log("prevmoves", prevMoves.join(" "));

            if (last_moves.slice(0, 4).join(" ") === prevMoves.join(" ")) {
              // console.log(move);
              new_moves.push(move);
              new_moves_time.push(Date.now());
              break;
            }
          }

          let cube_moves = [...this_App.state.cube_moves];
          let cube_moves_time = [...this_App.state.cube_moves_time];
          if (cube_moves.length === 0) {
            this_App.handle_solve_status("Scrambling");
          }
          if (this_App.state.solve_status === "Memo") {
            this_App.handle_solve_status("Solving");
          }
          for (i = 0; i < new_moves.length; i++) {
            cube_moves.push(new_moves[i]);
            cube_moves_time.push(Date.now());
          }
          this_App.setState({ cube_moves: cube_moves });
          this_App.setState({ cube_moves_time: cube_moves_time });
          this_App.setState({ giiker_prev_moves: prevMoves });
          this_App.handle_moves_to_show(cube_moves);
        }

        // if (DEBUG) {
        // var hexstr = [];
        // for (var i = 0; i < 40; i++) {
        // hexstr.push("0123456789abcdef".charAt(valhex[i]));
        // }
        // console.log("[giiker]", "Raw Data: ", valhex.join(""));
        // console.log('[giiker]', "Current State: ", facelet);
        // console.log('[giiker]', "A Valid Generator: ", scramble_333.genFacelet(facelet));
        // console.log(
        // "[giiker]",
        //  "Previous Moves: ",
        //  prevMoves.reverse().join(" ")
        // );
        // }
        // callback(facelet, prevMoves, timestamp, deviceName);
        // return [facelet, prevMoves];
      }

      function getBatteryLevel() {
        var _service;
        var _read;
        var _resolve;
        var listener = function (event) {
          _resolve([event.target.value.getUint8(1), deviceName]);
          _read.removeEventListener("characteristicvaluechanged", listener);
          _read.stopNotifications();
        };
        return _server
          .getPrimaryService(SERVICE_UUID_RW)
          .then(function (service) {
            _service = service;
            return service.getCharacteristic(CHRCT_UUID_READ);
          })
          .then(function (chrct) {
            _read = chrct;
            return _read.startNotifications();
          })
          .then(function () {
            return _read.addEventListener(
              "characteristicvaluechanged",
              listener
            );
          })
          .then(function () {
            return _service.getCharacteristic(CHRCT_UUID_WRITE);
          })
          .then(function (chrct) {
            chrct.writeValue(new Uint8Array([0xb5]).buffer);
            return new Promise(function (resolve) {
              _resolve = resolve;
            });
          });
      }

      return {
        init: init,
        opservs: [SERVICE_UUID_DATA, SERVICE_UUID_RW],
        getBatteryLevel: getBatteryLevel,
      };
    })();

    var GanCube = (function () {
      var _server;
      var _service_data;
      var _service_meta;
      var _chrct_f2;
      var _chrct_f5;
      var _chrct_f6;
      var _chrct_f7;

      var UUID_SUFFIX = "-0000-1000-8000-00805f9b34fb";
      var SERVICE_UUID_META = "0000180a" + UUID_SUFFIX;
      var CHRCT_UUID_VERSION = "00002a28" + UUID_SUFFIX;
      var CHRCT_UUID_HARDWARE = "00002a23" + UUID_SUFFIX;
      var SERVICE_UUID_DATA = "0000fff0" + UUID_SUFFIX;
      var CHRCT_UUID_F2 = "0000fff2" + UUID_SUFFIX; // cube state, (54 - 6) facelets, 3 bit per facelet
      // var CHRCT_UUID_F3 = "0000fff3" + UUID_SUFFIX; // prev moves
      var CHRCT_UUID_F5 = "0000fff5" + UUID_SUFFIX; // gyro state, move counter, pre moves
      var CHRCT_UUID_F6 = "0000fff6" + UUID_SUFFIX; // move counter, time offsets between premoves
      var CHRCT_UUID_F7 = "0000fff7" + UUID_SUFFIX;

      var decoder = null;

      var KEYS = [
        "NoRgnAHANATADDWJYwMxQOxiiEcfYgSK6Hpr4TYCs0IG1OEAbDszALpA",
        "NoNg7ANATFIQnARmogLBRUCs0oAYN8U5J45EQBmFADg0oJAOSlUQF0g",
      ];

      function getKey(version, value) {
        var key = KEYS[(version >> 8) & 0xff];
        if (!key) {
          return;
        }
        key = JSON.parse(LZString.decompressFromEncodedURIComponent(key));
        for (var i = 0; i < 6; i++) {
          key[i] = (key[i] + value.getUint8(5 - i)) & 0xff;
        }
        return key;
      }

      function decode(value) {
        var ret = [];
        for (var i = 0; i < value.byteLength; i++) {
          ret[i] = value.getUint8(i);
        }
        if (decoder == null) {
          return ret;
        }
        if (ret.length > 16) {
          ret = ret
            .slice(0, ret.length - 16)
            .concat(decoder.decrypt(ret.slice(ret.length - 16)));
        }
        decoder.decrypt(ret);
        return ret;
      }

      function checkHardware(server) {
        return server
          .getPrimaryService(SERVICE_UUID_META)
          .then(function (service_meta) {
            _service_meta = service_meta;
            return service_meta.getCharacteristic(CHRCT_UUID_VERSION);
          })
          .then(function (chrct) {
            return chrct.readValue();
          })
          .then(function (value) {
            var version =
              (value.getUint8(0) << 16) |
              (value.getUint8(1) << 8) |
              value.getUint8(2);
            // DEBUG && console.log('[gancube] version', JSON.stringify(version));
            decoder = null;
            if (version > 0x010007 && (version & 0xfffe00) === 0x010000) {
              return _service_meta
                .getCharacteristic(CHRCT_UUID_HARDWARE)
                .then(function (chrct) {
                  return chrct.readValue();
                })
                .then(function (value) {
                  var key = getKey(version, value);
                  if (!key) {
                    // logohint.push('Not support your Gan cube');
                    return;
                  }
                  // DEBUG && console.log('[gancube] key', JSON.stringify(key));
                  decoder = new aes128(key);
                });
            } else {
              //not support
              // logohint.push('Not support your Gan cube');
            }
          });
      }

      function init(device) {
        return device.gatt
          .connect()
          .then(function (server) {
            _server = server;
            return checkHardware(server);
          })
          .then(function () {
            return _server.getPrimaryService(SERVICE_UUID_DATA);
          })
          .then(function (service_data) {
            _service_data = service_data;
            return _service_data.getCharacteristic(CHRCT_UUID_F2);
          })
          .then(function (chrct) {
            _chrct_f2 = chrct;
            return _service_data.getCharacteristic(CHRCT_UUID_F5);
          })
          .then(function (chrct) {
            _chrct_f5 = chrct;
            return _service_data.getCharacteristic(CHRCT_UUID_F6);
          })
          .then(function (chrct) {
            this_App.handle_solve_status("Ready for scrambling");
            this_App.setState({ gan: true });
            _chrct_f6 = chrct;
            return _service_data.getCharacteristic(CHRCT_UUID_F7);
          })
          .then(function (chrct) {
            _chrct_f7 = chrct;
          })
          .then(loopRead);
      }

      var prevMoves;
      // var prevCubie = new mathlib.CubieCube();
      // var curCubie = new mathlib.CubieCube();
      var latestFacelet;
      var timestamp;
      var prevTimestamp = 0;
      var moveCnt = -1;
      var prevMoveCnt = -1;
      var movesFromLastCheck = 1000;

      function checkState() {
        if (movesFromLastCheck < 50) {
          return new Promise(function (resolve) {
            resolve(false);
          });
        }
        return _chrct_f2.readValue().then(function (value) {
          value = decode(value);
          var state = [];
          for (var i = 0; i < value.length - 2; i += 3) {
            var face =
              (value[i ^ 1] << 16) |
              (value[(i + 1) ^ 1] << 8) |
              value[(i + 2) ^ 1];
            for (var j = 21; j >= 0; j -= 3) {
              state.push("URFDLB".charAt((face >> j) & 0x7));
              if (j === 12) {
                state.push("URFDLB".charAt(i / 3));
              }
            }
          }
          latestFacelet = state.join("");
          movesFromLastCheck = 0;
          return new Promise(function (resolve) {
            resolve(true);
          });
        });
      }

      function loopRead() {
        if (!_device) {
          return;
        }
        return _chrct_f5
          .readValue()
          .then(function (value) {
            value = decode(value);
            // timestamp = $.now();
            moveCnt = value[12];
            if (moveCnt === prevMoveCnt) {
              return;
            }
            prevMoves = [];
            for (var i = 0; i < 6; i++) {
              var m = value[13 + i];
              // console.log("URFDLB".charAt(~~(m / 3)) + " 2'".charAt(m % 3));
              prevMoves.unshift(
                "URFDLB".charAt(~~(m / 3)) + " 2'".charAt(m % 3)
              );
            }
            var f6val;
            return _chrct_f6
              .readValue()
              .then(function (value) {
                value = decode(value);
                f6val = value;
                return checkState();
              })
              .then(function (isUpdated) {
                if (isUpdated && prevMoveCnt == -1) {
                  // callback(latestFacelet, prevMoves, timestamp, 'Gan 356i');
                  // prevCubie.fromFacelet(latestFacelet);
                  prevMoveCnt = moveCnt;
                  // if (latestFacelet != kernel.getProp('giiSolved', mathlib.SOLVED_FACELET)) {
                  // var rst = kernel.getProp('giiRST');
                  // if (rst == 'a' || rst == 'p' && confirm(CONFIRM_GIIRST)) {
                  // giikerutil.markSolved();
                  // }
                  // }
                  // return;
                }

                var timeOffs = [];
                for (var i = 0; i < 9; i++) {
                  var off = f6val[i * 2 + 1] | (f6val[i * 2 + 2] << 8);
                  timeOffs.unshift(~~(off / 0.95));
                }

                var moveDiff = (moveCnt - prevMoveCnt) & 0xff;
                prevMoveCnt = moveCnt;
                movesFromLastCheck += moveDiff;
                if (moveDiff > 6) {
                  movesFromLastCheck = 50;
                  moveDiff = 6;
                }
                var _timestamp = prevTimestamp;
                for (var i = moveDiff - 1; i >= 0; i--) {
                  _timestamp += timeOffs[i];
                }
                if (Math.abs(_timestamp - timestamp) > 2000) {
                  console.log(
                    "[gancube]",
                    "time adjust",
                    timestamp - _timestamp,
                    "@",
                    timestamp
                  );
                  prevTimestamp += timestamp - _timestamp;
                }

                let moves = {
                  0: "U",
                  1: "U2",
                  2: "U'",
                  3: "R",
                  4: "R2",
                  5: "R'",
                  6: "F",
                  7: "F2",
                  8: "F'",
                  9: "D",
                  10: "D2",
                  11: "D'",
                  12: "L",
                  13: "L2",
                  14: "L'",
                  15: "B",
                  16: "B2",
                  17: "B'",
                };
                const cube_moves_new = [...this_App.state.cube_moves];
                const cube_moves_time_new = [...this_App.state.cube_moves_time];
                for (var i = moveDiff - 1; i >= 0; i--) {
                  if (cube_moves_new.length === 0) {
                    this_App.handle_solve_status("Scrambling");
                  }
                  if (this_App.state.solve_status == "Memo") {
                    this_App.handle_solve_status("Solving");
                  }
                  var m =
                    "URFDLB".indexOf(prevMoves[i][0]) * 3 +
                    " 2'".indexOf(prevMoves[i][1]);
                  cube_moves_new.push(moves[m]);
                  cube_moves_time_new.push(Date.now());
                  this_App.setState({ cube_moves: cube_moves_new });
                  this_App.setState({ cube_moves_time: cube_moves_time_new });
                  this_App.handle_moves_to_show(cube_moves_new);
                  // mathlib.CubieCube.EdgeMult(prevCubie, mathlib.CubieCube.moveCube[m], curCubie);
                  // mathlib.CubieCube.CornMult(prevCubie, mathlib.CubieCube.moveCube[m], curCubie);
                  prevTimestamp += timeOffs[i];
                  // callback(curCubie.toFaceCube(), prevMoves.slice(i), prevTimestamp, 'Gan 356i');
                  // var tmp = curCubie;
                  // curCubie = prevCubie;
                  // prevCubie = tmp;
                }
                // if (isUpdated && prevCubie.toFaceCube() != latestFacelet) {
                // console.log('[gancube]', 'Cube state check error');
                // console.log('[gancube]', 'calc', prevCubie.toFaceCube());
                // console.log('[gancube]', 'read', latestFacelet);
                // prevCubie.fromFacelet(latestFacelet);
                // }
              });
          })
          .then(loopRead);
      }

      function getBatteryLevel() {
        return _chrct_f7.readValue().then(function (value) {
          value = decode(value);
          return new Promise(function (resolve) {
            resolve([value[7], "Gan 356i"]);
          });
        });
      }

      var aes128 = (function () {
        var Sbox = [
          99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171,
          118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156,
          164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241,
          113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226,
          235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179,
          41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190,
          57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2,
          127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182,
          218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196,
          167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136,
          70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92,
          194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213,
          78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28,
          166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181,
          102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248,
          152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140,
          161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22,
        ];
        var SboxI = [];
        var ShiftTabI = [0, 13, 10, 7, 4, 1, 14, 11, 8, 5, 2, 15, 12, 9, 6, 3];
        var xtime = [];

        function addRoundKey(state, rkey) {
          for (var i = 0; i < 16; i++) {
            state[i] ^= rkey[i];
          }
        }

        function shiftSubAdd(state, rkey) {
          var state0 = state.slice();
          for (var i = 0; i < 16; i++) {
            state[i] = SboxI[state0[ShiftTabI[i]]] ^ rkey[i];
          }
        }

        function mixColumnsInv(state) {
          for (var i = 0; i < 16; i += 4) {
            var s0 = state[i + 0];
            var s1 = state[i + 1];
            var s2 = state[i + 2];
            var s3 = state[i + 3];
            var h = s0 ^ s1 ^ s2 ^ s3;
            var xh = xtime[h];
            var h1 = xtime[xtime[xh ^ s0 ^ s2]] ^ h;
            var h2 = xtime[xtime[xh ^ s1 ^ s3]] ^ h;
            state[i + 0] ^= h1 ^ xtime[s0 ^ s1];
            state[i + 1] ^= h2 ^ xtime[s1 ^ s2];
            state[i + 2] ^= h1 ^ xtime[s2 ^ s3];
            state[i + 3] ^= h2 ^ xtime[s3 ^ s0];
          }
        }

        function init() {
          if (xtime.length != 0) {
            return;
          }
          for (var i = 0; i < 256; i++) {
            SboxI[Sbox[i]] = i;
          }
          for (var i = 0; i < 128; i++) {
            xtime[i] = i << 1;
            xtime[128 + i] = (i << 1) ^ 0x1b;
          }
        }

        function AES128(key) {
          init();
          var exKey = key.slice();
          var Rcon = 1;
          for (var i = 16; i < 176; i += 4) {
            var tmp = exKey.slice(i - 4, i);
            if (i % 16 == 0) {
              tmp = [
                Sbox[tmp[1]] ^ Rcon,
                Sbox[tmp[2]],
                Sbox[tmp[3]],
                Sbox[tmp[0]],
              ];
              Rcon = xtime[Rcon];
            }
            for (var j = 0; j < 4; j++) {
              exKey[i + j] = exKey[i + j - 16] ^ tmp[j];
            }
          }
          this.key = exKey;
        }

        AES128.prototype.decrypt = function (block) {
          addRoundKey(block, this.key.slice(160, 176));
          for (var i = 144; i >= 16; i -= 16) {
            shiftSubAdd(block, this.key.slice(i, i + 16));
            mixColumnsInv(block);
          }
          shiftSubAdd(block, this.key.slice(0, 16));
          return block;
        };

        return AES128;
      })();

      return {
        init: init,
        opservs: [SERVICE_UUID_DATA, SERVICE_UUID_META],
        getBatteryLevel: getBatteryLevel,
      };
    })();
    var GoCube = (function () {
      var _server;
      var _service;
      var _read;
      var _write;

      var UUID_SUFFIX = "-b5a3-f393-e0a9-e50e24dcca9e";
      var SERVICE_UUID = "6e400001" + UUID_SUFFIX;
      var CHRCT_UUID_WRITE = "6e400002" + UUID_SUFFIX;
      var CHRCT_UUID_READ = "6e400003" + UUID_SUFFIX;

      var WRITE_BATTERY = 50;
      var WRITE_STATE = 51;

      function init(device) {
        return device.gatt
          .connect()
          .then(function (server) {
            this_App.handle_solve_status("Ready for scrambling");
            _server = server;
            return server.getPrimaryService(SERVICE_UUID);
          })
          .then(function (service) {
            _service = service;
            return _service.getCharacteristic(CHRCT_UUID_WRITE);
          })
          .then(function (chrct) {
            _write = chrct;
            return _service.getCharacteristic(CHRCT_UUID_READ);
          })
          .then(function (chrct) {
            _read = chrct;
            return _read.startNotifications();
          })
          .then(function () {
            return _read.addEventListener(
              "characteristicvaluechanged",
              onStateChanged
            );
          })
          .then(function () {
            return _write.writeValue(new Uint8Array([WRITE_STATE]).buffer);
          });
      }

      function onStateChanged(event) {
        var value = event.target.value;
        parseData(value);
      }
      function reset_cube() {
        return _write
          .writeValue(new Uint8Array([WRITE_STATE]).buffer)
          .then(console.log("finish"));
      }
      function toHexVal(value) {
        var valhex = [];
        for (var i = 0; i < value.byteLength; i++) {
          valhex.push((value.getUint8(i) >> 4) & 0xf);
          valhex.push(value.getUint8(i) & 0xf);
        }
        return valhex;
      }

      var axisPerm = [5, 2, 0, 3, 1, 4];
      var facePerm = [0, 1, 2, 5, 8, 7, 6, 3];
      var faceOffset = [0, 0, 6, 2, 0, 0];
      var curBatteryLevel = -1;
      var batteryResolveList = [];
      var moveCntFree = 100;

      function parseData(value) {
        if (value.byteLength < 4) {
          return;
        }
        if (
          value.getUint8(0) != 0x2a ||
          value.getUint8(value.byteLength - 2) != 0x0d ||
          value.getUint8(value.byteLength - 1) != 0x0a
        ) {
          return;
        }
        var msgType = value.getUint8(2);
        var msgLen = value.byteLength - 6;
        if (msgType == 1) {
          // move
          // console.log(toHexVal(value));
          for (var i = 0; i < msgLen; i += 2) {
            var axis = axisPerm[value.getUint8(3 + i) >> 1];
            var power = [0, 2][value.getUint8(3 + i) & 1];
            var m = axis * 3 + power;

            const cube_moves_new = [...this_App.state.cube_moves];
            const cube_moves_time_new = [...this_App.state.cube_moves_time];
            if (cube_moves_new.length === 0) {
              this_App.handle_solve_status("Scrambling");
            }
            if (this_App.state.solve_status == "Memo") {
              this_App.handle_solve_status("Solving");
            }
            cube_moves_new.push("URFDLB".charAt(axis) + " 2'".charAt(power));
            cube_moves_time_new.push(Date.now());
            this_App.setState({ cube_moves: cube_moves_new });
            this_App.setState({ cube_moves_time: cube_moves_time_new });
            this_App.handle_moves_to_show(cube_moves_new);

            // console.log(this_App.state.cube_moves.join(" "));
            // document.getElementById("moves_print").textContent = this.state.cube_moves.join(' ')
          }
        } else if (msgType === 2) {
          // cube state
          var facelet = [];
          for (var a = 0; a < 6; a++) {
            var axis = axisPerm[a] * 9;
            var aoff = faceOffset[a];
            facelet[axis + 4] = "BFUDRL".charAt(value.getUint8(3 + a * 9));
            for (var i = 0; i < 8; i++) {
              facelet[axis + facePerm[(i + aoff) % 8]] = "BFUDRL".charAt(
                value.getUint8(3 + a * 9 + i + 1)
              );
            }
          }
          var newFacelet = facelet.join("");
          // if (newFacelet != curFacelet) {
          //     console.log('facelet', newFacelet);
          //
          // }
        } else if (msgType === 3) {
          // quaternion
        } else if (msgType === 5) {
          // battery level
          console.log("battery level", toHexVal(value));
          curBatteryLevel = value.getUint8(3);
          while (batteryResolveList.length !== 0) {
            batteryResolveList.shift()(curBatteryLevel);
          }
        } else if (msgType === 7) {
          // offline stats
          console.log("offline stats", toHexVal(value));
        } else if (msgType === 8) {
          // cube type
          console.log("cube type", toHexVal(value));
        }
      }

      function getBatteryLevel() {
        _write.writeValue(new Uint8Array([WRITE_BATTERY]).buffer);
        return new Promise(function (resolve) {
          batteryResolveList.push(resolve);
        });
      }

      return {
        init: init,
        opservs: [SERVICE_UUID],
        getBatteryLevel: getBatteryLevel,
        reset_cube: reset_cube,
      };
    })();
    var MoyuCube = (function () {
      var _server;
      var _service;
      var _read;
      var _write;
      var _turn;
      var _gyro;
      var _debug;

      var faces_state = { D: 0, L: 0, B: 0, R: 0, F: 0, U: 0 };
      var faces_dict = { 0: "D", 1: "L", 2: "B", 3: "R", 4: "F", 5: "U" };

      var UUID_SUFFIX = "-0000-1000-8000-00805f9b34fb";
      var SERVICE_UUID = "00001000" + UUID_SUFFIX;
      var TURN_CHRCT = "00001003" + UUID_SUFFIX;
      var GYRO_CHRCT = "00001004" + UUID_SUFFIX;
      var DEBUG_CHRCT = "00001005" + UUID_SUFFIX;
      var WRITE_CHRCT = "00001001" + UUID_SUFFIX;
      var READ_CHRCT = "00001002" + UUID_SUFFIX;

      function init(device) {
        return device.gatt
          .connect()
          .then(function (server) {
            _server = server;
            return _server.getPrimaryService(SERVICE_UUID);
          })
          .then(function (service) {
            _service = service;
            return _service.getCharacteristic(WRITE_CHRCT);
          })
          .then(function (chrct) {
            _write = chrct;
            return _service.getCharacteristic(TURN_CHRCT);
          })
          .then(function (chrct) {
            _turn = chrct;
            return _turn.startNotifications();
          })
          .then(function () {
            return _turn.addEventListener(
              "characteristicvaluechanged",
              onStateChangedTurn
            );
          })
          .then(function (chrct) {
            _gyro = chrct;
            return _service.getCharacteristic(GYRO_CHRCT);
          })
          .then(function (chrct) {
            _gyro = chrct;
            return _gyro.startNotifications();
          })
          .then(function () {
            return _gyro.addEventListener(
              "characteristicvaluechanged",
              onStateChangedGyro
            );
          })
          .then(function (chrct) {
            _read = chrct;
            return _service.getCharacteristic(READ_CHRCT);
          })
          .then(function (chrct) {
            _read = chrct;
            return _read.startNotifications();
          })
          .then(function () {
            this_App.handle_solve_status("Ready for scrambling");
            return _read.addEventListener(
              "characteristicvaluechanged",
              onStateChangedRead
            );
          })

          .then(function (chrct) {
            _debug = chrct;
            return _service.getCharacteristic(DEBUG_CHRCT);
          })
          .then(function (chrct) {
            _debug = chrct;
            return _debug.startNotifications();
          })
          .then(function () {
            return _debug.addEventListener(
              "characteristicvaluechanged",
              onStateChangedDebug
            );
          })

          .then(function () {
            // var write_value = new Uint8Array([10 | 1 << 4 | 0 << 5]).buffer;
            // _write.
            // return _write.writeValue(write_value).then(console.log("finish"));
            // var write_value = new Uint8Array([10 | (0 << 4) | (1 << 5)]).buffer;
            // console.log(write_value);
            // return _write.writeValue(write_value).then(console.log("finish"));
          });
      }
      function onStateChanged(event) {
        var value = event.target.value;
        parseData(value);
      }
      function onStateChangedTurn(event) {
        var value = event.target.value;
        // console.log("turn");
        parseTurns(value);
      }
      function onStateChangedRead(event) {
        var value = event.target.value;
        console.log("read");
        var array = new Uint8Array(value.buffer);
        console.log(array);
      }
      function onStateChangedGyro(event) {
        var value = event.target.value;
        // console.log("gyro");
        // console.log(value);
      }
      function onStateChangedDebug(event) {
        var value = event.target.value;
        // console.log("debug");
        // console.log(value);
      }

      // function reset_cube() {
      //   return _write
      //     .writeValue(new Uint8Array([WRITE_STATE]).buffer)
      //     .then(console.log("finish"));
      // }
      function newMoves(face_turned) {
        const cube_moves_new = [...this_App.state.cube_moves];
        const cube_moves_time_new = [...this_App.state.cube_moves_time];
        if (cube_moves_new.length === 0) {
          this_App.handle_solve_status("Scrambling");
        }
        if (this_App.state.solve_status == "Memo") {
          this_App.handle_solve_status("Solving");
        }
        var move_applied;
        if (faces_state[face_turned] == 90) {
          move_applied = face_turned;
          faces_state[face_turned] = 0;
        } else if (faces_state[face_turned] == -90) {
          move_applied = face_turned + "'";
          faces_state[face_turned] = 0;
        }
        cube_moves_new.push(move_applied);
        cube_moves_time_new.push(Date.now());
        this_App.setState({ cube_moves: cube_moves_new });
        this_App.setState({ cube_moves_time: cube_moves_time_new });
        this_App.handle_moves_to_show(cube_moves_new);
      }

      function parseTurns(value) {
        var array = new Uint8Array(value.buffer);
        var number_of_turns = array[0];
        var face_turned;
        var turn_direction;
        for (var i = 0; i < number_of_turns; i++) {
          face_turned = faces_dict[array[5 + i * 6]];
          turn_direction = array[6 + i * 6] == 220 ? -10 : 10;
          faces_state[face_turned] += turn_direction;
          if (faces_state[face_turned] % 90 == 0) {
            newMoves(face_turned);
          }
        }
      }

      function parseData(value) {
        const cube_moves_new = [...this_App.state.cube_moves];
        const cube_moves_time_new = [...this_App.state.cube_moves_time];
        if (cube_moves_new.length === 0) {
          this_App.handle_solve_status("Scrambling");
        }
        if (this_App.state.solve_status == "Memo") {
          this_App.handle_solve_status("Solving");
        }
        // cube_moves_new.push("URFDLB".charAt(axis) + " 2'".charAt(power));
        cube_moves_time_new.push(Date.now());
        this_App.setState({ cube_moves: cube_moves_new });
        this_App.setState({ cube_moves_time: cube_moves_time_new });
        this_App.handle_moves_to_show(cube_moves_new);

        // console.log(this_App.state.cube_moves.join(" "));
        // document.getElementById("moves_print").textContent = this.state.cube_moves.join(' ')
      }

      return {
        init: init,
        opservs: [SERVICE_UUID],
        // reset_cube: reset_cube,
      };
    })();
    function init() {
      var cube = null;
      if (!navigator || !navigator.bluetooth) {
        alert(
          "Bluetooth API is not available. Ensure https access, and try chrome with chrome://flags/#enable-experimental-web-platform-features enabled"
        );
        return Promise.resolve();
      }
      var go_cube_service = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

      return navigator.bluetooth
        .requestDevice({
          filters: [
            {
              namePrefix: "Gi",
            },
            {
              namePrefix: "Mi Smart Magic Cube",
            },
            {
              namePrefix: "GAN",
            },
            {
              namePrefix: "MHC",
            },
            {
              namePrefix: "GoCube",
            },
            {
              namePrefix: "Rubiks",
            },
            {
              services: ["0000fe95-0000-1000-8000-00805f9b34fb"],
            },
            {
              services: [go_cube_service], // services: [GiikerCube.opservs[0]]
            },
          ],
          optionalServices: [].concat(
            GiikerCube.opservs,
            GanCube.opservs,
            GoCube.opservs,
            MoyuCube.opservs
          ),
        })
        .then(function (device) {
          console.log(device);
          _device = device;
          this_App.handle_solve_status("Connecting...");
          if (
            device.name.startsWith("Gi") ||
            device.name.startsWith("Mi Smart Magic Cube")
          ) {
            cube = GiikerCube;
            this_App.setState({ cube: cube });
            return GiikerCube.init(device);
          } else if (device.name.startsWith("GAN")) {
            cube = GanCube;
            this_App.setState({ cube: cube });
            return GanCube.init(device);
          } else if (
            device.name.startsWith("GoCube") ||
            device.name.startsWith("Rubiks")
          ) {
            cube = GoCube;
            this_App.setState({ cube: cube });
            return GoCube.init(device);
          } else if (device.name.startsWith("MHC")) {
            cube = MoyuCube;
            this_App.setState({ cube: cube });
            return MoyuCube.init(device);
          } else {
            return Promise.resolve();
          }
        });
    }
    init();
  };
}
export default App;
