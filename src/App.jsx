import React from 'react';
import { connect } from 'react-redux';

import Logo from './Logo';
import Presenters from './Presenters';
import Screen from './Screen';
import Countdown from './Countdown';
import Form from './Form';
import { click } from './actions';

const App = props =>
  (props.isSubmited ? (
    <div className="wrapper" onClick={props.handleClick}>
      {/* prettier-ignore */}
      <style jsx>{`
        .wrapper {
          height: 100%;
          width: 100%;
          display: grid;
          grid-template-areas:
            'logo       screen'
            'presenters screen'
            'presenters timer ';
          grid-template-columns: 15em 1fr;
          grid-template-rows: auto 1fr auto;
          background: #111;
          color: #fff;
        }
      `}
      </style>
      <Logo />
      <Presenters />
      <Screen />
      <Countdown />
    </div>
  ) : (
    <Form />
  ));

export default connect(
  ({ presenters }) => ({ isSubmited: presenters.length !== 0 }),
  dispatch => ({ handleClick: () => dispatch(click()) }),
)(App);
