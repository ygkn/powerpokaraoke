import React from "react";
import { connect } from "react-redux";
import { CSSTransition } from "react-transition-group";

import { nextPresenter } from "./actions";

import Title from "./Title";

const Screen = props => (
  <div className="screen">
    {/* prettier-ignore */}
    <style jsx>{`
      .screen {
        grid-area: screen;
        position: relative;
        overflow: hidden;
        background: #333;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .timeup {
        text-align: center;
        z-index: 2;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        font-weight: bold;
        font-size: 10em;
        color: red;
        background: #111;
        transition: transform 800ms cubic-bezier(0, 0, 0.2, 1);
        transform: translateY(-100%);
      }
      .timeup.show {
        transform: translateY(0);
      }
    `}
    </style>
    <div className={`timeup ${props.screen === "timeup" && "show"}`}>
      TIME<br />IS<br />UP
    </div>
    <Title />
    <img src={props.slides[props.displayingSlide]} />
  </div>
);

export default connect(({ screen, slides, displayingSlide }) => ({
  screen,
  slides,
  displayingSlide
}))(Screen);
