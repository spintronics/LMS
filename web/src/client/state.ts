import { assocPath, concat, mergeDeepRight, mergeRight, pathOr } from "ramda";
import { $assocPath, $getOr, $path, toPromise } from "../lib/util.js";

export enum ActionName {
  openQuestion = "openQuestion",
  correctAnswer = "correctAnswer",
  loadTopics = "loadTopics",
}

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

// interface ActionHandler<T> {
//   handler: (state: T, data: any) => T | Promise<T>,
//   cache?: boolean
// }

type ActionHandler<T> = (state: T, data: any) => T | Promise<T>;
type ActionWrapper<T> = (
  state: T,
  data: any
) => [state: T, data: any] | Promise<[state: T, data: any]>;

// type ActionHandler<T> = (state: T, data: any) => object;

class State<T> {
  private pool: { [key: string]: Listener[] } = {};
  private state: T;
  private handlers: { [key: string]: ActionHandler<T> } = {};
  private cache;
  constructor(initialState: T, config: { cache?: boolean }) {
    let { cache = false } = config;
    // for (let path of cache) {
    //   let cachedValue = localStorage.getItem(path);
    //   if (cachedValue) {
    //     initialState = assocPath($path(path), cachedValue, initialState);
    //   }
    // }

    if (cache) {
      try {
        let cachedState = JSON.parse(localStorage.getItem("state"));
        // i know what i'm doing typescript!
        initialState = (mergeDeepRight(
          cachedState,
          (initialState as unknown) as object
        ) as unknown) as T;
      } catch (e) {
        console.log(`couldnt load saved state: ${e}`);
      }
    }

    this.cache = cache;

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
      if (this.cache) {
        localStorage.setItem("state", JSON.stringify(newState));
      }
      return this.state;
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
  wrapHandler(
    handler: ActionHandler<T>,
    hooks: { before?: ActionWrapper<T>; after?: (state: T) => T }
  ) {
    hooks = Object.assign(
      {
        before: (...a) => a,
        after: (a) => a,
      },
      hooks
    );
    const wrapped: ActionHandler<T> = function (state: T, data: any) {
      let { before, after } = hooks;
      return toPromise(hooks.before(state, data))
        .then((args) => handler(...args))
        .then(after);
    };
    return wrapped;
  }
  register(
    name: string,
    handler: ActionHandler<T>,
    config: { listener?: Listener; cache?: (state: T) => T } = {}
  ) {
    let { cache, listener } = config;

    if (cache) {
      this.handlers[name] = this.wrapHandler(handler, { after: cache });
    } else {
      this.handlers[name] = handler;
    }

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

export function cachePaths(paths: string[]) {
  return function (state) {
    for (let path of paths) {
      let value = $getOr(null, path, state);
      if (value) {
        localStorage.setItem(String(path), JSON.stringify(value));
      }
    }
    return state;
  };
}

export const cachePath = (path: string) => cachePaths([path]);

export const state = new State<LmsState>(defaultState, {
  cache: true,
});

(window as any).state = state;

state.register(ActionName.correctAnswer, (state, path) => {
  if (!path || !path.length) return state;
  let full_path: string[] = ["topics"].concat(path.concat(["correct_answers"]));
  return assocPath(full_path, $getOr(0, path, state) + 1, state);
});

state.register(ActionName.openQuestion, (state, data) => {
  if (!data.path || !data.path.length) return state;
  if (!state.history) state.history = [];
  state.history.push(data.path.join("~"));
  if (state.history.length > state.history_size) {
    state.history.shift();
  }
  return state;
});

state.register(ActionName.loadTopics, (state, topics) => {
  state.topics = mergeDeepRight(state.topics, topics);
  return state;
});
