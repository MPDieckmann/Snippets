/// <reference path="../default.module.d.ts" />

import { ExtendableModule } from "./extendablemodule.module";

class MPCDevtoolsElement extends HTMLElement {
  constructor() {
    super();
    var header = document.createElementNS("http://www.w3.org/1999/xhtml", "header");
    this._mpc_shadowRoot.appendChild(header);
  }
  private _mpc_shadowRoot: ShadowRoot = this.attachShadow({
    mode: "closed",
    delegatesFocus: false
  });
  private _modules: Set<ExtendableModule> = new Set();
  protected $addModule(module: ExtendableModule) {
    this._modules.delete(module);
    this._modules.add(module);
  }
  protected $removeModule(module: ExtendableModule) {
    this._modules.delete(module);
  }
  public get modules(): ReadonlyArray<ExtendableModule> {
    return Array.from(this._modules);
  }
}
customElements.define("mpc-devtools", MPCDevtoolsElement);