import React from 'react';
import Slot from 'react-slot-machine';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { resolveScopedStyles } from './helper';

const Title = props => (
  console.log(props.screen),
  (
    <CSSTransition
      in={['none', 'name', 'subject'].includes(props.screen)}
      // TODO: timeout
      timeout={0}
      classNames="curten"
      mountOnEnter
      unmountOnExit
    >
      <div className="wrapper">
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
        }
        .wrapper:global(.curten-exit) {
          transform: translateY(0);
        }
        .wrapper:global(.curten-exit-active) {
          transform: translateY(-100%);
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
          target={['name', 'subject'].includes(props.screen) ? props.nowPresenting + 1 : 0}
        >
          {[
            <div className="item">? ? ?</div>,
            ...props.presenters.map(({ name, image }) => (
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
          target={props.screen === 'subject' ? props.nowPresenting + 1 : 0}
        >
          {[
            <div className="item">? ? ?</div>,
            ...props.subjects.map(subject => <div className="item">{subject}</div>),
          ]}
        </Slot>
      </div>
    </CSSTransition>
  )
);

export default connect(state => state)(Title);
