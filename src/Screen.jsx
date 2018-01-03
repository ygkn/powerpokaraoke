import React from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import { nextPresenter } from './actions';

import Title from './Title';
import Timeup from './Timeup';

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
    `}
    </style>
    <Timeup />
    <Title />
    <img src={props.slides[props.displayingSlide]} />
  </div>
);

export default connect(({ screen, slides, displayingSlide }) => ({
  screen,
  slides,
  displayingSlide,
}))(Screen);
