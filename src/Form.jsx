import React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { submitForm } from './actions';

const shuffle = (array) => {
  const result = [...array];
  for (let i = length - 1; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    const tmp = result[i];
    result[i] = result[r];
    result[r] = tmp;
  }

  return result;
};

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLimit: 3,
      slides: [],
      subjects: [],
      presenters: [],
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.onSubmit({
      ...this.state,
      presenterIndexs: shuffle([...Array(this.state.presenters.length)].map((_, i) => i)),
      subjectIndexs: shuffle([...Array(this.state.subjects.length)].map((_, i) => i)),
      slides: shuffle(this.state.slides),
    });
  }

  handleInputTimeLimit(timeLimit) {
    this.setState({ timeLimit });
  }

  handleSlideDrop(files) {
    this.setState({
      slides: [...this.state.slides, ...files.map(file => window.URL.createObjectURL(file))],
    });
  }

  handleInputSubjects(text) {
    this.setState({ subjects: text.split('\n') });
  }

  handleAddPresenter() {
    this.setState({
      presenters: [...this.state.presenters, { image: null, name: '' }],
    });
  }
  handleDropPresenterImage(file, index) {
    this.setState({
      presenters: [
        ...this.state.presenters.slice(0, index),
        {
          name: this.state.presenters[index].name,
          image: window.URL.createObjectURL(file),
        },
        ...this.state.presenters.slice(index + 1),
      ],
    });
  }

  handleInputPresenterName(name, index) {
    this.setState({
      presenters: [
        ...this.state.presenters.slice(0, index),
        {
          image: this.state.presenters[index].image,
          name,
        },
        ...this.state.presenters.slice(index + 1),
      ],
    });
  }

  render() {
    return (
      <div className="wrapper">
        {/* prettier-ignore */}
        <style jsx>{`
            form {
              width: 600px;
              margin: auto;
              display: flex;
              flex-direction: column;
              height: 100%;
            }
            input,
            button {
              color: #fff;
              background: transparent;
              border: solid 1px;
              border-radius: 3px;
            }
            label {
              display: block;
            }
            .wrapper {
              background: #222;
              color: #fff;
              height: 100vh;
            }
            .slides :global(.dropzone) {
              width: 100%;
              height: 150px;
              overflow: auto;
              border: solid 1px;
              display: flex;
              flex-wrap: wrap;
            }
            .slides .preview {
              background: #000;
              width: 200px;
              height: 150px;
              margin: 10px;
              border: solid 8px #fff;
              border-radius: 8px;
              object-fit: contain;
            }
            .subjects textarea {
              width: 100%;
              min-height: 10em;
              background: transparent;
              color: #fff;
            }
            ul {
              margin: 0;
              padding: 0;
              list-style: none;
              flex: 1;
              overflow: auto;
            }
            ul li {
              display: flex;
            }
            ul li input {
              flex: 1;
            }
            ul li img {
              width: 100%;
              height: 100%
            }
            ul :global(.dropzone) {
              width: 5em;
              height: 5em;
              border: solid 1px;
            }
            .persenters .preview {
              width: 100%;
              height: 100%;
              object-fit: cover;
              background: #000;
            }
          `}
        </style>
        <form onSubmit={e => this.handleSubmit(e)}>
          <label>
            Time Limit (min.)
            <input
              value={this.state.timeLimit}
              type="number"
              min="0"
              onInput={e => this.handleInputTimeLimit(parseInt(e.target.value, 10))}
            />
          </label>
          <label className="slides">
            <Dropzone className="dropzone" onDrop={files => this.handleSlideDrop(files)}>
              {this.state.slides.length
                ? this.state.slides.map(slide => <img className="preview" src={slide} />)
                : 'Drop Slide'}
            </Dropzone>
          </label>
          <label className="subjects">
            Subject (Separate by line breaks.)
            <br />
            <textarea onInput={e => this.handleInputSubjects(e.target.value)} />
          </label>
          <label>
            <button onClick={() => this.handleAddPresenter()} type="button">
              Add presenters
            </button>
          </label>
          <ul className="presenters">
            {this.state.presenters.map(({ image, name }, index) => (
              <li key={index}>
                <Dropzone
                  className="dropzone"
                  multiple={false}
                  onDrop={files => this.handleDropPresenterImage(files[0], index)}
                >
                  <img className="preview" src={image} />
                </Dropzone>
                <input
                  type="text"
                  value={name}
                  onInput={e => this.handleInputPresenterName(e.target.value, index)}
                />
              </li>
            ))}
          </ul>
          <button>SUBMIT</button>
        </form>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    onSubmit: payload => dispatch(submitForm(payload)),
  }),
)(Form);
