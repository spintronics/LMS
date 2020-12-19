import { LitElement, html, customElement, property, css } from 'lit-element';
import { state, Listener, ActionName } from '../state.js';

@customElement('lms-question')
export class Question extends LitElement {
  @property({ type: String }) src = '';
  @property({ type: String }) error = '';
  @property({ type: String }) questionSet = 'default';
  static get styles() {
    return css`
      #question {
        size: 15px;
        font-family: Roboto;
      }
      img {
        width: 100%;
      }
    `;
  }

  updateQuestion;

  constructor() {
    super();
    this.updateQuestion = new Listener((message) => {
      this.src = message.details.path;
    });
    state.subscribe(ActionName.openQuestion, this.updateQuestion);
  }

  question() {
    if (!this.src) return null;
    return html` <img src=${'/questions/' + this.src} /> `;
  }

  render() {
    return html` <div>${this.question()}</div> `;
  }
}

// declare global {
//   interface HTMLElementTagNameMap {
//     "lms-question": Question;
//   }
// }
