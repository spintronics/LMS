import "@material/mwc-button";
import { LitElement, html, customElement, property, css } from "lit-element";
import { api, apiUrl } from "../lib/api.js";

interface QuestionResponse {
  content: string;
}

@customElement("lms-question")
export class Question extends LitElement {
  @property({ type: String }) question = "";
  @property({ type: String }) error = "";
  @property({ type: String }) questionSet = "default";
  static get styles() {
    return css`
      #question {
        size: 15px;
        font-family: Roboto;
      }
    `;
  }

  async getNewQuestion(correctResponse: boolean) {
    try {
      //this is pretty verbose.. should make api a class that does this for the consumer
      let response = await api<LMS.api.QuestionRequest, LMS.Question>(
        apiUrl.question,
        { questionSet: this.questionSet }
      );
      if (response.success) {
        this.question = response.data.content;
      }
    } catch (e) {
      this.error = e;
    }
  }

  render() {
    return html`
      <div>
        <p id="question">${this.question}</p>
        <mwc-button @click=${this.getNewQuestion.bind(this, true)}
          >Correct</mwc-button
        >
        <mwc-button @click=${this.getNewQuestion.bind(this, false)}
          >Incorrect</mwc-button
        >
      </div>
    `;
  }
}

// declare global {
//   interface HTMLElementTagNameMap {
//     "lms-question": Question;
//   }
// }
