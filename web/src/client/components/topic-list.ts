import { css, customElement, html, LitElement, property } from "lit-element";
import {
  any,
  assocPath,
  concat,
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
  toPairs,
  values,
} from "ramda";
import { state, ActionName, Listener, cachePaths } from "../state.js";
import { getTopics } from "../../lib/api.js";
import { $assocPath, $getOr } from "../../lib/util.js";

enum TopicListActions {
  updateWeight = "updateWeight",
}

@customElement("lms-topic-list")
export class TopicList extends LitElement {
  @property({ type: Object }) topicTree: TopicNode = {};
  @property({ type: Object }) weights: { [key: string]: number } = {};
  private listeners: { [key: string]: Listener } = {
    updateWeight: new Listener(() => this.requestUpdate()),
    loadTopics: new Listener(() => (this.topicTree = state.get("topics"))),
  };
  constructor() {
    super();
    state.register(
      TopicListActions.updateWeight,
      (state: any, data) => {
        return assocPath(
          `topics~${data.path.join("~")}~weight`.split("~"),
          data.weight,
          state
        );
      },
      {
        listener: this.listeners.updateWeight,
      }
    );
    state.subscribe(ActionName.loadTopics, this.listeners.loadTopics);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    values(this.listeners).forEach((l) => l.destroy());
  }
  firstUpdated() {
    this.fetchTopics();
  }
  protected async fetchTopics() {
    let [err, paths] = await getTopics();
    if (err) return;
    let topicTree: TopicNode = reduce(
      (a, parts) => assocPath(parts, { is_question: true }, a),
      {},
      paths.data
    );
    topicTree.expanded = true;
    state.dispatch(ActionName.loadTopics, topicTree);
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
    _path = _path.concat(["expanded"]);
    let expanded = path(_path, this.topicTree);
    this.topicTree = assocPath(_path, !expanded, this.topicTree);
  }
  expandAll(node: TopicNode, recursive = false, expand = true) {
    if (!Object.keys(node).length) return node;
    for (let [key, child] of toPairs(node)) {
      if (typeof child == "object") {
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
    state.dispatch(ActionName.openQuestion, { path });
  }
  enable(path: string[]) {
    this.topicTree = assocPath(path.concat("enabled"), true);
  }
  disable(path: string[]) {
    this.topicTree = assocPath(path.concat("enabled"), false);
  }
  toggleEnabled(path: string[]) {
    let enabled = pathOr(true, path.concat("enabled"), this.topicTree);
    this.topicTree = assocPath(path, !enabled, this.topicTree);
  }
  updateWeight(path: string[], event: CustomEvent) {
    let weight = (event.target as any)?.value;
    if (isNaN(weight)) return;
    state.dispatch(TopicListActions.updateWeight, { path, weight });
  }
  buildList(node: TopicNode, name = "Topics", path = []) {
    if (!Object.keys(node).length) return [];
    return html`
      <div class="list-header">
        <span class="list-name">${name}</span>
        <mwc-icon-button
          @click=${this.toggleExpanded.bind(this, path)}
          icon=${node.expanded ? "expand_less" : "expand_more"}
        ></mwc-icon-button>
        <mwc-icon-button
          @click=${this.expandAll.bind(this, node, false, !node.unfolded)}
          icon=${node.unfolded ? "unfold_less" : "unfold_more"}
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
          style="display:${path.length ? "inline-block" : "none"}"
          value=${node.weight}
        ></mwc-slider>
      </div>
      <mwc-list ?expanded=${node.expanded}>
        ${toPairs(node)
          .map(([key, value], index) => {
            if (typeof value == "object") {
              if (value.is_question) {
                return html`<mwc-list-item
                  @click=${this.openProblem.bind(this, path.concat([key]))}
                  path=${path}
                  >${index + 1}</mwc-list-item
                >`;
              }
              return this.buildList(node[key], key, path.concat([key]));
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
        <!-- <mwc-button raised @click=${this.fetchTopics.bind(this)}
          >Fetch Topics</mwc-button
        > -->
        ${this.buildList(this.topicTree)}
      </div>
    `;
  }
}
