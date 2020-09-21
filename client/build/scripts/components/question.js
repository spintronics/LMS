var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "@material/mwc-button";
import { LitElement, html, customElement, property, css } from "lit-element";
import axios from "axios";
let Question = class Question extends LitElement {
    constructor() {
        super(...arguments);
        this.question = "";
        this.error = "";
    }
    static get styles() {
        return css `
      #question {
        size: 15px;
        font-family: Roboto;
      }
    `;
    }
    getNewQuestion(correctResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.question = yield axios.post("/api/spaced-repition/new-question", {
                    correctResponse,
                });
            }
            catch (e) {
                this.error = e;
            }
        });
    }
    render() {
        return html `
      <>
        <p id="question">${this.question}</p>
        <mwc-button @click=${this.getNewQuestion.bind(this, true)}>Correct</mwc-button>
        <mwc-button @click=${this.getNewQuestion.bind(this, false)}>Incorrect</mwc-button>
      </>
    `;
    }
};
__decorate([
    property({ type: String })
], Question.prototype, "question", void 0);
__decorate([
    property({ type: String })
], Question.prototype, "error", void 0);
Question = __decorate([
    customElement("lms-question")
], Question);
export { Question };
// declare global {
//   interface HTMLElementTagNameMap {
//     "lms-question": Question;
//   }
// }
//# sourceMappingURL=question.js.map