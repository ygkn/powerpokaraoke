import React from "react";
import { connect } from "react-redux";

import { timeup } from "./actions";

const CLOCK_STROKE_WIDTH = 44 * 2 * Math.PI;

class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = { remaining: this.props.timeLimit, timer: null };
  }

  componentDidMount() {
    if (this.props.isCountdowning) this.startCountdown();
  }

  componentDidUpdate({ isCountdowning: hadCountdowned }) {
    if (hadCountdowned === this.props.isCountdowning) return;
    if (this.props.isCountdowning) {
      this.startCountdown();
    } else {
      this.stopCountdown();
    }
  }

  startCountdown() {
    console.log("start");
    this.setState({
      remaining: this.props.timeLimit,
      timer: setInterval(() => this.tick(), 1000)
    });
  }

  stopCountdown() {
    console.log("stop");
    clearInterval(this.state.timer);
    this.setState({
      remaining: this.props.timeLimit,
      timer: null
    });
    this.props.onEnd();
  }

  tick() {
    console.log("tick");
    const remaining = this.state.remaining - 1;
    if (remaining < 0) {
      this.stopCountdown();
    } else {
      this.setState({ remaining });
    }
  }

  render() {
    const second = String(this.state.remaining % 60).padStart(2, "0");
    const minutes = String(Math.floor(this.state.remaining / 60)).padStart(
      2,
      "0"
    );
    const strokeDashoffset = this.props.isCountdowning
      ? CLOCK_STROKE_WIDTH * (1 - this.state.remaining / this.props.timeLimit)
      : 0;

    return (
      <div className="wraper">
        {/* prettier-ignore */}
        <style jsx>{`
            .wraper {
              grid-area: timer;
              display: flex;
              justify-content: flex-end;
            }
            .timer {
              height: 5em;
              width: 5em;
              position: relative;
              font-family: 'Julius Sans One', sans-serif;
            }
            svg {
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              transform: rotate(-90deg) scaleY(-1);
            }
            circle {
              fill: none;
              stroke-linejoin: round;
              stroke-width: 5px;
              cx: 50;
              cy: 50;
              r: 44;
            }
            .clock {
              stroke: #555;
            }
            .clock-hand {
              stroke: #09f;
              stroke-dasharray: ${CLOCK_STROKE_WIDTH};
              stroke-dashoffset: 0;
              transition: stroke-dashoffset 1s linear;
            }
            .time {
              text-align: center;
              font-size: 1.5em;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              line-height: ${5 / 1.5};
            }
          `}
        </style>
        <div className="timer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96.732 96.732">
            <circle className="clock" />
            <circle className="clock-hand" style={{ strokeDashoffset }} />
          </svg>
          <span className="time">{`${minutes}:${second}`}</span>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ timeLimit, screen }) => ({
    timeLimit: timeLimit * 60,
    isCountdowning: screen === "slide"
  }),
  dispatch => ({ onEnd: () => dispatch(timeup()) })
)(Countdown);
