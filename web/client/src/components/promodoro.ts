import "@material/mwc-button";
import { LitElement, html, customElement, property, css } from "lit-element";

enum TimerStage {
    study,
    break,
    longBreak
}

@customElement('lms-promodoro')
export class Promodoro extends LitElement {
    @property({ type: Number }) time = 0;
    @property({ type: Boolean }) running = false;
    @property({ type: TimerStage }) stage = TimerStage.break;
    @property({ type: Boolean }) ringing = false;

    studyDuration = 30 * 60;
    breakDuration = 5 * 60;
    longBreakDuration = 25 * 60;
    cyclesPerSession = 4;


    protected cycle: number = 1;
    protected timerInterval;

    static get styles() {
        return css`
            :host {
                font-family: Roboto;
                size: 3em;
            }
            .clock[ringing] {
                animation: ringing 1s infinite;
            }
            @keyframes ringing {
                0% {
                    filter: Glow(Color=#FF0000, Strength=60)
                }
                100% {
                    filter: Glow(Color=#FF0000, Strength=0)
                }
            }
        `
    }
    start() {
        this.timerInterval = setInterval(_ => {
            if (this.time == 0) {
                this.stop()
            }
            this.time -= 1
        }, 1000)
    }
    stop() {
        clearInterval(this.timerInterval)
        this.ringing = true;
    }
    nextState() {
        if (this.stage == TimerStage.study) {
            if (this.cycle == this.cyclesPerSession) {
                this.stage = TimerStage.longBreak
                this.cycle = 1;
            } else {
                this.stage = TimerStage.break
            }
        } else {
            this.stage = TimerStage.study
        }
    }
    pause() {
        clearInterval(this.timerInterval)
    }
    render() {
        return html`
            <div>
                <div ?ringing=${this.ringing} class="clock">${Math.floor(this.time / 60)}:${this.time % 60}</div>
                <div class="controls">
                    <mwc-button .ringing @click=${this.start}>Start</mwc-button>
                    <mwc-button @click=${this.pause}>Pause</mwc-button>
                    <mwc-button @click=${this.stop}>Stop</mwc-button>
                </div>
            </div>
        `
    }
}