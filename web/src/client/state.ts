import { assocPath, concat, pathOr } from "ramda";
import { $assocPath, $getOr, $path } from "../lib/util.js";

export enum ActionName {
  openQuestion = "openQuestion",
  correctAnswer = "correctAnswer",
}

interface LmsState {
  topics: TopicNode;
  history: string[];
  history_size: number;
}

const defaultState = {
  topics: {},
  history: [],
  history_size: 10,
};

// export interface Message {
//   sender?: string;
//   data: any;
// }

export class Listener {
  private active = true;
  private fn;
  destroyed = false;
  constructor(fn: (message: any) => any) {
    this.fn = fn;
  }
  on() {
    this.active = true;
    return this;
  }
  off() {
    this.active = false;
    return this;
  }
  destroy() {
    this.destroyed = true;
    return this;
  }
  consume(data) {
    if (!this.active || this.destroyed) return Promise.resolve();
    let result = this.fn(data);
    return result instanceof Promise ? result : Promise.resolve(result);
  }
}

type ActionHandler<T> = (state: T, data: any) => object;

class State<T> {
  private pool: { [key: string]: Listener[] } = {};
  private state: T | object = {};
  private handlers = {};
  constructor(initialState: T) {
    this.state = initialState;
  }
  dispatch(name: string, data: any): Promise<any> {
    // wrap the state update and allow handlers to be async
    let update =
      name in this.handlers
        ? this.handlers[name](this.state, data)
        : Promise.resolve(this.state);

    update = (update instanceof Promise
      ? update
      : Promise.resolve(update)
    ).then((newState) => {
      if (newState) this.state = newState;
    });

    return name in this.pool
      ? update
          .then(() =>
            Promise.all(
              this.pool[name].map((listener) => listener.consume(data))
            )
          )
          .then(() => {
            // remove destroyed listeners
            this.pool[name] = this.pool[name].filter((l) => !l.destroyed);
          })
      : update;
  }
  register(name: string, handler: ActionHandler<T>, listener?: Listener) {
    this.handlers[name] = handler;
    if (listener) {
      this.subscribe(name, listener);
    }
  }
  subscribe(name: string, listener?: Listener) {
    if (!(name in this.pool)) {
      this.pool[name] = [];
    }
    this.pool[name].push(listener);
  }
  //do not abuse, you have been warned
  set(path: string[] | string, value: any) {
    if (!path || !path.length) return;
    if (!"playing nice") throw "a fit";
    this.state = assocPath($path(path), value, this.state);
  }
  //free use
  get(path: string[] | string, def = null) {
    return pathOr(def, $path(path), this.state);
  }
}

export const state = new State<LmsState>(defaultState);

(window as any).state = state;

state.register(ActionName.correctAnswer, (state, path) => {
  if (!path || !path.length) return state;
  path = ["topics"].concat(path.concat(["correct_answers"]));
  return assocPath(path, $getOr(0, path, state) + 1, state);
});

state.register(ActionName.openQuestion, (state, data) => {
  if (!data.path || !data.path.length) return state;
  if (!state.history) state.history = [];
  state.history.push(data.path.join("~"));
  if (state.history.length > state.history_size) {
    state.history.shift();
  }
});
