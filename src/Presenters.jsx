import React from 'react';
import { connect } from 'react-redux';

class Presenters extends React.Component {
  constructor(props) {
    super(props);
    this.nameCards = [];
  }

  componentDidUpdate() {
    this.nameCard.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }

  render() {
    return (
      <ul>
        {/* prettier-ignore */}
        <style jsx>{`
            ul {
              grid-area: presenters;
              list-style: none;
              overflow: auto;
              padding: 0;
              margin: 0;
              color: #ccc;
            }
            li {
              display: flex;
              background: transparent;
              align-items: center;
              overflow: hidden;
            }
            li.presenting {
              background: #333;
            }
            li:after {
              content: '▼';
              width: 1em;
              height: 1em;
              transition: 0.5s;
              transform: rotate(-90deg) scale(0);
            }
            li.presenting:after {
              transform: rotate(-90deg) scale(1);
            }
            .name {
              flex: 1;
              overflow: hidden;
              　white-space: nowrap;
              　text-overflow: ellipsis;
            }
            img, .noimage {    height: 1.5em;
              display: inline-block;
              width: 1.5em;
              font-size: 2em;
              background: #bbb;
              color: #333;
              display: flex;
              align-items: center;
              justify-content: center;
              object-fit: cover;
            }
          `}
        </style>
        {this.props.presenterIndexs.map(index => (
          <li
            key={index}
            ref={(ref) => {
              if (index === this.props.nowPresenting) this.nameCard = ref;
            }}
            className={index === this.props.nowPresenting && 'presenting'}
          >
            {this.props.nowPresenting > index ||
            (this.props.nowPresenting === index && this.props.showTitle)
              ? [
                <img src={this.props.presenters[index].image} />,
                <span className="name">
                  {this.props.presenters[index].name}
                  <br />
                  {this.props.showSubject
                      ? this.props.subjects[this.props.subjectIndexs[index]]
                      : '? ? ? ?'}
                </span>,
                ]
              : [
                <span className="noimage">?</span>,
                <span className="name">
                    ? ? ?<br />? ? ? ?
                </span>,
                ]}
          </li>
        ))}
      </ul>
    );
  }
}

export default connect(({
  nowPresenting, screen, presenters, presenterIndexs, subjects, subjectIndexs,
}) => ({
  nowPresenting,
  showTitle: screen === 'subject' || screen === 'slide' || screen === 'timeup',
  showSubject: screen === 'slide' || screen === 'timeup',
  presenters,
  presenterIndexs,
  subjects,
  subjectIndexs,
}))(Presenters);
