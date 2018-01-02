import React from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { nextPresenter } from './actions';

import Title from './Title';

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
      .timeup{
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
      }
      .timeup:global(.curten-enter) {
        transform: translateY(-100%);
      }
      .timeup:global(.curten-enter-active) {
        transform: translateY(0);
        transition: transform 1000ms ease-out;
      }
      .timeup:global(.curten-exit) {
        transform: translateY(0);
      }
      .timeup:global(.curten-exit-active) {
        transform: translateY(-100%);
        transition: transform 800ms ease-in;
      }
    `}
    </style>
    <CSSTransition
      classNames="curten"
      // TODO: timeout
      timeout={0}
      in={props.screen === 'timeup'}
      mountOnEnter
      unmountOnExit
    >
      <div className="timeup">
        TIME<br />IS<br />UP
      </div>
    </CSSTransition>
    <Title />
    <img src={props.slides[props.displayingSlide]} />
  </div>
);

export default connect(({ screen, slides, displayingSlide }) => ({
  screen,
  slides,
  displayingSlide,
}))(Screen);
