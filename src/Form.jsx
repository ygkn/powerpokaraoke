import React from "react";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";
import Modal from "react-modal";
import Logo from "./Logo";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
  faImages,
  faFileAlt,
  faStopwatch,
  faPlusSquare,
  faCog,
  faCamera
} from "@fortawesome/fontawesome-free-solid";

import { submitForm } from "./actions";

const shuffle = array => {
  const result = [...array];
  for (let i = array.length - 1; i > 0; i--) {
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
      formData: {
        timeLimit: 3,
        slides: [],
        subjects: "",
        presenters: [{ image: null, name: "" }]
      },
      modal: "none"
    };
  }

  openModal(modal) {
    this.setState({ modal });
  }

  closeModal() {
    this.setState({ modal: "none" });
  }

  handleSubmit(e) {
    e.preventDefault();
    const subjects = this.state.formData.subjects.split("\n").filter(v => v);

    this.props.onSubmit({
      ...this.state.formData,
      presenterIndexs: shuffle(this.state.formData.presenters.map((_, i) => i)),
      subjectIndexs: shuffle(subjects.map((_, i) => i)),
      slides: shuffle(this.state.formData.slides),
      subjects
    });
  }

  handleInputTimeLimit(timeLimit) {
    this.setState({ formData: { ...this.state.formData, timeLimit } });
  }

  handleSlideDrop(files) {
    this.setState({
      formData: {
        ...this.state.formData,
        slides: [
          ...this.state.formData.slides,
          ...files.map(file => window.URL.createObjectURL(file))
        ]
      }
    });
  }

  handleInputSubjects(text) {
    this.setState({
      formData: { ...this.state.formData, subjects: text }
    });
  }

  handleAddPresenter() {
    this.setState({
      formData: {
        ...this.state.formData,
        presenters: [
          ...this.state.formData.presenters,
          { image: null, name: "" }
        ]
      }
    });
  }
  handleDropPresenterImage(file, index) {
    this.setState({
      formData: {
        ...this.state.formData,
        presenters: [
          ...this.state.formData.presenters.slice(0, index),
          {
            name: this.state.formData.presenters[index].name,
            image: window.URL.createObjectURL(file)
          },
          ...this.state.formData.presenters.slice(index + 1)
        ]
      }
    });
  }

  handleInputPresenterName(name, index) {
    this.setState({
      formData: {
        ...this.state.formData,
        presenters: [
          ...this.state.formData.presenters.slice(0, index),
          {
            image: this.state.formData.presenters[index].image,
            name
          },
          ...this.state.formData.presenters.slice(index + 1)
        ]
      }
    });
  }

  render() {
    return (
      <div className="wrapper">
        {/* prettier-ignore */}
        <style jsx>{`
            form {
              max-width: 800px;
              margin: auto;
              display: flex;
              flex-direction: column;
              height: 100%;
            }
            input,
            button,
            textarea {
              color: inherit;
              background: transparent;
              border: solid 1px;
              margin: .3em
            }
            button {
              background: linear-gradient(to bottom, rgba(255,255,255,.2) 0%,rgba(255,255,255,0) 100%);
              border-radius: 3px;
              padding: .5em
            }
            label {
              display: block;
            }
            .wrapper {
              background: #111;
              color: #eee;
              height: 100vh;
            }
            .wrapper :global(.logo) {
              width: 50%;
            }
            :global(.slides-dropzone), .input-subjects {
              overflow: auto;
              border: solid 1px;
              display: flex;
              flex-wrap: wrap;
              flex: 1;
              margin: 1em;
              background: transparent;
              color: #fff;
              resize: none;
            }
            :global(.slides-dropzone) .preview {
              background: #000;
              width: 200px;
              height: 200px;
              margin: 10px;
              border: solid 8px #fff;
              object-fit: contain;
            }
            ul {
              margin: 0;
              padding: 0;
              list-style: none;
              flex: 1;
              overflow: auto;
            }
            ul li {
              margin: .3em;
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
              width: 2.5em;
              height: 2.5em;
              border: solid 1px;
              font-size: 1.5em;
              line-height: 2.5em;
              text-align: center;
            }
            .persenters .preview {
              width: 100%;
              height: 100%;
              object-fit: cover;
              background: #000;
            }
            :global(.modal) {
              background: #111;
              color: #eee;
              position: fixed;
              top: 3em;
              bottom: 3em;
              left: 0;
              right: 0;
              width: 600px;
              margin: 0 auto;
              display: flex;
              flex-direction: column;
            }
            :global(.modal-overlay) {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, .5);
            }
          `}
        </style>
        <form onSubmit={e => this.handleSubmit(e)}>
          <Logo svgClassName="logo" />
          <label>
            <FontAwesomeIcon icon={faStopwatch} />
            &nbsp; 制限時間（分）
            <input
              value={this.state.formData.timeLimit}
              type="number"
              min="1"
              max="99"
              onInput={e =>
                this.handleInputTimeLimit(parseInt(e.target.value, 10))
              }
            />
            <button type="button" onClick={() => this.openModal("slide")}>
              <FontAwesomeIcon icon={faImages} />
              &nbsp;
              {`スライド（${this.state.formData.slides.length}）`}
            </button>
            <button type="button" onClick={() => this.openModal("subject")}>
              <FontAwesomeIcon icon={faFileAlt} />
              &nbsp;
              {`お題（${
                this.state.formData.subjects.split("\n").filter(v => v).length
              }）`}
            </button>
            <button>
              <FontAwesomeIcon icon={faCog} />&nbsp;設定
            </button>
          </label>
          <Modal
            isOpen={this.state.modal === "slide"}
            contentLabel="Slides"
            className="modal"
            overlayClassName="modal-overlay"
          >
            <Dropzone
              className="slides-dropzone"
              onDrop={files => this.handleSlideDrop(files)}
              accept="image/*"
            >
              {this.state.formData.slides.length
                ? this.state.formData.slides.map(slide => (
                    <img className="preview" src={slide} />
                  ))
                : "クリックまたはドロップでスライドを追加"}
            </Dropzone>
            <button onClick={() => this.closeModal()}>完了</button>
          </Modal>
          <Modal
            isOpen={this.state.modal === "subject"}
            contentLabel="Subjects"
            className="modal"
            overlayClassName="modal-overlay"
          >
            <p>
              <FontAwesomeIcon icon={faFileAlt} />
              &nbsp; お題（改行区切り）
            </p>
            <textarea
              className="input-subjects"
              onInput={e => this.handleInputSubjects(e.target.value)}
              value={this.state.formData.subjects}
            />
            <button onClick={() => this.closeModal()}>完了</button>
          </Modal>
          <label>
            <button onClick={() => this.handleAddPresenter()} type="button">
              <FontAwesomeIcon icon={faPlusSquare} />
              &nbsp; 出場者を追加
            </button>
          </label>
          <ul className="presenters">
            {this.state.formData.presenters.map(({ image, name }, index) => (
              <li key={index}>
                <Dropzone
                  className="dropzone"
                  multiple={false}
                  accept="image/*"
                  onDrop={files =>
                    this.handleDropPresenterImage(files[0], index)
                  }
                >
                  {image != null ? (
                    <img className="preview" src={image} />
                  ) : (
                    <FontAwesomeIcon icon={faCamera} />
                  )}
                </Dropzone>
                <input
                  type="text"
                  value={name}
                  onInput={e =>
                    this.handleInputPresenterName(e.target.value, index)
                  }
                  placeholder="出場者名を入力…"
                />
              </li>
            ))}
          </ul>
          <button>START</button>
        </form>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    onSubmit: payload => dispatch(submitForm(payload))
  })
)(Form);
