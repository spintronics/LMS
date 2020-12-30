import { LitElement, html, customElement, property, css } from 'lit-element';
import { state, Listener, ActionName } from '../state.js';
import { selectQuestion } from '../lib/api.js';

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
      #controls {
        display: flex;
        justify-content: space-around;
      }
    `;
  }

  updateQuestion;

  constructor() {
    super();
    this.updateQuestion = new Listener((data) => {
      this.src =
        typeof data.path === 'string' ? data.path : data.path.join('/');
    });
    state.subscribe(ActionName.openQuestion, this.updateQuestion);
  }

  question() {
    if (!this.src) return null;
    return html` <img src=${'/topics/' + this.src} /> `;
  }

  async selectQuestion() {
    let tree = state.get('topics', {});
    let history = state.get('history', []);
    let [err, resp] = await selectQuestion(tree, history);
    if (!err) {
      state.dispatch(ActionName.openQuestion, { path: resp.data });
    }
  }

  async correctAnswer() {
    if (this.src) {
      state.dispatch(ActionName.correctAnswer, this.src.split('/'));
    }
    this.selectQuestion();
  }

  render() {
    return html`
      <div>
        <div id="controls">
          <mwc-button raised @click=${this.correctAnswer}>Correct</mwc-button>
          <mwc-button raised @click=${this.selectQuestion}>Next</mwc-button>
        </div>
        ${this.question()}
      </div>
    `;
  }
}

// declare global {
//   interface HTMLElementTagNameMap {
//     "lms-question": Question;
//   }
// }
