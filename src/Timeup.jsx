import React from 'react';
import { connect } from 'react-redux';

const player = new Audio('gong-played2.mp3');

class Timeup extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate({ screen }) {
    if (this.props.enableSound && screen !== 'timeup' && this.props.screen === 'timeup') {
      player.play();
    }
  }

  render() {
    return (
      <div className={`timeup ${this.props.screen === 'timeup' && 'show'}`}>
        {/* prettier-ignore */}
        <style jsx>{`
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
        `}</style>
        TIME<br />IS<br />UP
      </div>
    );
  }
}

export default connect(({ screen, enableSound }) => ({ screen, enableSound }))(Timeup);
