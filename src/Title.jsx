import React from 'react';
import Slot from 'react-slot-machine';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

const rollPlayer = new Audio('drum-roll1.mp3');
rollPlayer.loop = true;
const finishPlayer = new Audio('roll-finish1.mp3');

class Title extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate({ screen }) {
    if (
      this.props.enableSound &&
      screen !== this.props.screen &&
      ['name', 'subject'].includes(this.props.screen)
    ) {
      rollPlayer.play();
      setTimeout(() => {
        rollPlayer.pause();
        finishPlayer.play();
      }, 3000);
    }
  }

  render() {
    return (
      <div
        className={`wrapper ${['none', 'name', 'subject'].includes(this.props.screen) && 'show'}`}
      >
        {/* prettier-ignore */}
        <style jsx>{`
        .wrapper {
          font-weight: bold;
          display: flex;
          justify-content: space-evenly;
          flex-direction: column;
          z-index: 1;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #ccc;
          color: #222;
          align-items: center;
          transition: transform 800ms ease-in;
          transform: translateY(-100%);
        }
        .wrapper.show {
          transition: none;
          transform: translateY(0);
        }
        .wrapper :global(.name) {
          width: 300px;
          height: 300px;
          border: #fff 2px;
        }
        .wrapper :global(.name) .item {
          text-align: center;
          align-items: center;
          justify-content: space-evenly;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .wrapper :global(.name) .item img { 
          width: 100px;
          height: 100px;
          object-fit: cover;
        }
        .wrapper :global(.subject) {
          width: 100%;
          height: 2em;
        }
        .wrapper :global(.subject) .item {
          text-align: center;
          height: 100%;
        }
      `}
        </style>
        <Slot
          className="name"
          times={2}
          target={this.props.screen !== 'none' ? this.props.nowPresenting + 1 : 0}
        >
          {[
            <div className="item">? ? ?</div>,
            ...this.props.presenters.map(({ name, image }) => (
              <div className="item">
                <img src={image} />
                <p>{name}</p>
              </div>
            )),
          ]}
        </Slot>
        <Slot
          className="subject"
          times={2}
          target={
            this.props.screen !== 'none' && this.props.screen !== 'name'
              ? this.props.nowPresenting + 1
              : 0
          }
        >
          {[
            <div className="item">? ? ?</div>,
            ...this.props.subjects.map(subject => <div className="item">{subject}</div>),
          ]}
        </Slot>
      </div>
    );
  }
}

export default connect(state => state)(Title);
