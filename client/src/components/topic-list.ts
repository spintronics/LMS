import { css, customElement, html, LitElement, property } from 'lit-element';
import {
  assocPath,
  flatten,
  init,
  last,
  lensPath,
  map,
  path,
  pathOr,
  pipe,
  reduce,
  replace,
  set,
  split,
  values,
} from 'ramda';
import { state, ActionName, Listener } from '../state.js';
import { getQuestions } from '../lib/api.js';
import { $assocPath } from '../lib/util.js';

interface TopicNode {
  expanded?: boolean;
  unolded?: boolean;
  weight?: number;
  enabled?: boolean;
  [key: string]: any | TopicNode;
}

enum TopicListActions {
  updateWeight,
}

//initialize weights
state.set('topics', {});

@customElement('lms-topic-list')
export class TopicList extends LitElement {
  @property({ type: Object }) topicTree: TopicNode = {};
  @property({ type: Object }) weights: { [key: string]: number } = {};
  listeners: { [key: string]: Listener } = {
    updateWeight: new Listener(() => this.requestUpdate()),
  };
  constructor() {
    super();
    state.register(
      TopicListActions.updateWeight,
      (state: any, data) => {
        state.topics[data.path] = data.weight;
        return state;
      },
      this.listeners.updateWeight
    );
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    values(this.listeners).forEach((l) => l.destroy());
  }
  protected async fetchTopics() {
    let paths = await getQuestions();
    let topicTree = pipe(
      map(pipe(replace('../client/questions\\', ''), split(/[\\,\/]/))),
      reduce((a, parts) => assocPath(parts, last(parts), a), {})
    )(paths.data);
    this.topicTree = topicTree;
    this.topicTree.expanded = true;
  }
  static get styles() {
    return css`
      mwc-list {
        padding-left: 15px;
        border-left: 1px solid var(--secondary);
        display: none;
        cursor: pointer;
      }
      mwc-list[expanded] {
        display: block;
      }
      .list-header {
        display: flex;
        align-items: center;
      }
      .list-name {
        padding: 12px;
      }
      mwx-switch {
        padding: 0 12px;
      }
    `;
  }
  toggleExpanded(_path: string[]) {
    if (!this.topicTree) return;
    _path = _path.concat(['expanded']);
    let expanded = path(_path, this.topicTree);
    this.topicTree = assocPath(_path, !expanded, this.topicTree);
  }
  expandAll(node: TopicNode, recursive = false, expand = true) {
    if (!Object.keys(node).length) return node;
    for (let [key, child] of Object.entries(node)) {
      if (typeof child == 'object') {
        this.expandAll(child, true, expand);
      }
    }
    node.expanded = expand;
    node.unfolded = expand;

    if (!recursive) this.requestUpdate();
  }
  collapseAll(node: TopicNode) {
    this.expandAll(node, false, false);
  }
  openProblem(path: string) {
    state.dispatch(ActionName.openQuestion, { details: { path } });
  }
  enable(path: string[]) {
    this.topicTree = assocPath(path.concat('enabled'), true);
  }
  disable(path: string[]) {
    this.topicTree = assocPath(path.concat('enabled'), false);
  }
  toggleEnabled(path: string[]) {
    let enabled = pathOr(true, path.concat('enabled'), this.topicTree);
    this.topicTree = assocPath(path, !enabled, this.topicTree);
  }
  updateWeight(path: string[], event: CustomEvent) {
    let weight = (event.target as any)?.value;
    if (isNaN(weight)) return;
    state.dispatch(TopicListActions.updateWeight, { path, weight });
  }
  buildList(node, name = 'Topics', path = []) {
    if (!Object.keys(node).length) return [];
    return html`
      <div class="list-header">
        <span class="list-name">${name}</span>
        <mwc-icon-button
          @click=${this.toggleExpanded.bind(this, path)}
          icon=${node.expanded ? 'expand_less' : 'expand_more'}
        ></mwc-icon-button>
        <mwc-icon-button
          @click=${this.expandAll.bind(this, node, false, !node.unfolded)}
          icon=${node.unfolded ? 'unfold_less' : 'unfold_more'}
        ></mwc-icon-button>
      </div>
      <div class="list-header">
        <mwc-switch
          style="display:none;"
          ?checked=${node.enabled}
          @click=${this.toggleEnabled.bind(this, path)}
        ></mwc-switch>
        <mwc-slider
          @change=${this.updateWeight.bind(this, path)}
          ?enabled=${node.enabled}
        ></mwc-slider>
      </div>
      <mwc-list ?expanded=${node.expanded}>
        ${Object.entries(node)
          .map(([key, value]) => {
            if (typeof value == 'object') {
              return this.buildList(node[key], key, path.concat([key]));
            }
            if (typeof value == 'string') {
              return html`<mwc-list-item
                @click=${this.openProblem.bind(
                  this,
                  path.concat([value]).join('/')
                )}
                path=${path}
                >${value}</mwc-list-item
              >`;
            }
            return null;
          })
          .filter(Boolean)}
      </mwc-list>
    `;
  }
  render() {
    return html`
      <div>
        <mwc-button raised @click=${this.fetchTopics.bind(this)}
          >Fetch Topics</mwc-button
        >
        ${this.buildList(this.topicTree)}
      </div>
    `;
  }
}
