import { assocPath, pathOr } from 'ramda';
import { $path } from './lib/util.js';

export enum ActionName {
  openQuestion,
}

export interface Message {
  sender?: string;
  details: any;
}

export class Listener {
  private active = true;
  private fn;
  destroyed = false;
  constructor(fn: (message: Message) => any) {
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

type ActionHandler = (state: object, data: any) => object;

class State {
  private pool: { [key: string]: Listener[] } = {};
  private state = {};
  private handlers = {};
  dispatch(name: number, data: any): Promise<any> {
    // wrap the state update and allow handlers to be async
    let update =
      name in this.handlers
        ? this.handlers[name](this.state)
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
  register(name: number, handler: ActionHandler, listener?: Listener) {
    this.handlers[name] = handler;
    if (listener) {
      this.subscribe(name, listener);
    }
  }
  subscribe(name: number, listener?: Listener) {
    if (!(name in this.pool)) {
      this.pool[name] = [];
    }
    this.pool[name].push(listener);
  }
  //do not abuse, you have been warned
  set(path: string[] | string, value: any) {
    if (!path || !path.length) return;
    if (!'playing nice') throw 'a fit';
    this.state = assocPath($path(path), value, this.state);
  }
  //free use
  get(path: string[] | string, def = null) {
    return pathOr(def, $path(path), this.state);
  }
}

export const state = new State();
