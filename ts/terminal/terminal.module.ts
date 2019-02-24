/// <reference path="../default.module.d.ts" />

export class MPCTerminalElement extends HTMLElement {
  private _mpc_shadowRoot: ShadowRoot = this.attachShadow({
    mode: "closed",
    delegatesFocus: false
  });

  static readonly version = "2019.02.19";

  constructor() {
    super();

    var div: HTMLDivElement = <HTMLDivElement>document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    div.classList.add("line", "input");
    div.id = "input";
    this._mpc_shadowRoot.appendChild(div);

    var style = document.createElementNS("http://www.w3.org/1999/xhtml", "style");
    style.textContent =
      ":host { display: block; background: #222; color: #eee; font: 10pt/1.25 Terminal, System, Fixedsys, monospace; padding: 0.25em; }" +
      ".line { min-height: 1em; }" +
      "#input textarea { display: block; width: 100%; height: auto; white-space: pre; color: inherit; background: inherit; font: inherit; resize: none; border: none; overflow: auto; padding: 0; margin: 0; outline: none; }" +
      ".input, .output, .error { padding-left: 0.75em; overflow: auto; position: relative; }" +
      ".input::before, .output::before, .error::before { display: block; font-weight: bold; position: absolute; top: 0; left: 0; content: '>'; }" +
      ".output::before { content: '<'; }" +
      ".error::before { color: #e00; content: 'X'; }";
    div.appendChild(style);

    this.$textarea.rows = 1;

    this.$textarea.addEventListener("keydown", event => {
      if (event.keyCode == 13 && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
        // Enter (no shiftKey, no altKey, no ctrlKey, no metaKey)
        this.$textarea.value = this.$textarea.value.trim();
        if (this.$textarea.value.length == 0) {
          return;
        }
        this.appendLine(this.$textarea.value, "input");
        this.evalOnTarget(this.$textarea.value).then(r => this.appendLine(r, "output"), e => this.appendLine(e, "error"));
        this.$history[this._historyLength++] = this.$textarea.value;
        this.$textarea.value = "";
        event.preventDefault();
      } else if (event.keyCode == 38 && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
        // ArrowUp (no shiftKey, no altKey, no ctrlKey, no metaKey)
        this.$historyIndex--;
      } else if (event.keyCode == 40 && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
        // ArrowDown (no shiftKey, no altKey, no ctrlKey, no metaKey)
        this.$historyIndex++;
      }

      this.$textarea.rows = this.$textarea.value.split("\n").length;
    });
    this.$textarea.addEventListener("keypress", () => {
      this.$textarea.rows = this.$textarea.value.split("\n").length;
    });
    this.$textarea.addEventListener("keyup", () => {
      this.$textarea.rows = this.$textarea.value.split("\n").length;
    });
    this.$textarea.addEventListener("paste", () => {
      this.$textarea.rows = this.$textarea.value.split("\n").length;
    });
    div.appendChild(this.$textarea);

    this.addEventListener("focus", () => {
      this.$textarea.focus();
    });

    this.$greeting();

    this.focus();
  }

  protected $greeting() {
    this.clear();
    this.appendLine("MPC Terminal [Version " + MPCTerminalElement.version + "]", "log");
    this.appendLine("\u00a9 2019 MPDieckmann. All Rights Reserved.", "log");
    if (this._target) {
      this.appendLine("Connected to: " + this._target.location, "log");
    } else {
      this.appendLine("Not connected");
    }
    this.appendLine("", "log");
  }

  protected $textarea: HTMLTextAreaElement = <HTMLTextAreaElement>document.createElementNS("http://www.w3.org/1999/xhtml", "textarea");

  protected $history: string[] = [];
  private _historyIndex: number = 0;
  private _historyLength: number = 0;
  protected get $historyIndex(): number {
    return this._historyIndex;
  }
  protected set $historyIndex(value: number) {
    if (value < 0) {
      value = 0;
    } else if (value > this._historyLength) {
      value = this._historyLength;
    }
    if (this._historyIndex == this._historyLength) {
      this.$history[this._historyLength] = this.$textarea.value;
    }
    this._historyIndex = value;
    this.$textarea.value = this.$history[value] || "";
    this.$textarea.rows = this.$textarea.value.split("\n").length;
  }

  public get value(): string {
    return this.$textarea.value;
  }

  clear() {
    while (this._mpc_shadowRoot.firstChild && this._mpc_shadowRoot.firstChild !== this._mpc_shadowRoot.lastChild) {
      this._mpc_shadowRoot.removeChild(this._mpc_shadowRoot.firstChild);
    }
  }

  public evalOnTarget(x: string | String) {
    return new Promise((resolve, reject) => {
      if (typeof x == "string" || x instanceof String) {
        x = x.trim();
        if (x.length > 0) {
          if (this._target == null) {
            reject(new Error("mpc-terminal is not connected"));
          } else {
            try {
              resolve(this._target.eval.call(this._target, x));
            } catch (e) {
              reject(e);
            }
          }
        }
      }
    });
  }

  public appendLine(value: any, type: "input" | "output" | "log" | "warn" | "error" = "log") {
    var div = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    div.classList.add("line", type);
    div.appendChild(document.createTextNode(value));
    this._mpc_shadowRoot.insertBefore(div, this._mpc_shadowRoot.lastChild);
  }

  static get observedAttributes() {
    return ["target", "ontargetconnect", "ontargetconnected", "ontargetdisconnected"];
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "target":
        var target: HTMLIFrameElement | TerminalTarget = self[newValue];
        if (typeof target == "object") {
          if ("contentWindow" in target && (<HTMLIFrameElement>target).contentWindow) {
            this.target = <any>(<HTMLIFrameElement>target).contentWindow;
          } else {
            this.target = <TerminalTarget>target;
          }
        }
        break;
      case "ontargetconnect":
        this.ontargetconnect = <(this: MPCTerminalElement, event: TerminalEvent) => any>new Function("event", newValue);
        break;
      case "ontargetconnected":
        this.ontargetconnected = <(this: MPCTerminalElement, event: TerminalEvent) => any>new Function("event", newValue);
        break;
      case "ontargetdisconnected":
        this.ontargetdisconnected = <(this: MPCTerminalElement, event: TerminalEvent) => any>new Function("event", newValue);
        break;
    }
  }

  private _target: TerminalTarget = null;
  public get target(): TerminalTarget {
    return this._target;
  }
  public set target(value: TerminalTarget) {
    if (this._target == value) {
      return;
    }

    // trigger target disconnected
    var disconnectedEvent = new TerminalEvent("disconnected", {
      cancelable: false,
      terminalTarget: this._target
    });
    this.dispatchEvent(disconnectedEvent);

    if (
      "eval" in value &&
      "addEventListener" in value &&
      "removeEventListener" in value
    ) {

      // trigger connecting target
      var connectEvent = new TerminalEvent("connect", {
        cancelable: true,
        terminalTarget: value
      });
      if (this.dispatchEvent(connectEvent)) {
        // connect target
        this._target = value;

        var $this = this;

        // set event for automatically removing target on unload
        this._target.addEventListener("unload", function onunload() {
          $this._target.removeEventListener("unload", onunload);
          $this.target = null;
        });

        this.$greeting();

        // trigger target connected
        var connectedEvent = new TerminalEvent("connected", {
          cancelable: true,
          terminalTarget: value
        });
        this.dispatchEvent(connectedEvent);
      }

    }
  }

  private _ontargetconnect: (this: MPCTerminalElement, event: TerminalEvent) => any = null;
  public get ontargetconnect(): (this: MPCTerminalElement, event: TerminalEvent) => any {
    return this._ontargetconnect;
  }
  public set ontargetconnect(value: (this: MPCTerminalElement, event: TerminalEvent) => any) {
    if (this._ontargetconnect == value) {
      return;
    }
    this.removeEventListener("targetconnect", value);
    this._ontargetconnect = value;
    if (value) {
      this.addEventListener("targetconnect", value);
    }
  }

  private _ontargetconnected: (this: MPCTerminalElement, event: TerminalEvent) => any = null;
  public get ontargetconnected(): (this: MPCTerminalElement, event: TerminalEvent) => any {
    return this._ontargetconnected;
  }
  public set ontargetconnected(value: (this: MPCTerminalElement, event: TerminalEvent) => any) {
    if (this._ontargetconnected == value) {
      return;
    }
    this.removeEventListener("targetconnected", value);
    this._ontargetconnected = value;
    if (value) {
      this.addEventListener("targetconnected", value);
    }
  }

  private _ontargetdisconnected: (this: MPCTerminalElement, event: TerminalEvent) => any = null;
  public get ontargetdisconnected(): (this: MPCTerminalElement, event: TerminalEvent) => any {
    return this._ontargetdisconnected;
  }
  public set ontargetdisconnected(value: (this: MPCTerminalElement, event: TerminalEvent) => any) {
    if (this._ontargetdisconnected == value) {
      return;
    }
    this.removeEventListener("targetdisconnected", value);
    this._ontargetdisconnected = value;
    if (value) {
      this.addEventListener("targetdisconnected", value);
    }
  }
}

export interface TerminalTarget extends EventTarget {
  eval(x: string): any;
  location: Location;
}

customElements.define("mpc-terminal", MPCTerminalElement);

export class TerminalEvent extends Event {
  constructor(type: string, eventInitDict: TerminalEventInit = {}) {
    super(type, eventInitDict);

    if ("terminalTarget" in eventInitDict) {
      this._terminalTarget = eventInitDict.terminalTarget;
    }
  }

  private _terminalTarget: TerminalTarget;
  public get terminalTarget(): TerminalTarget {
    return this._terminalTarget;
  }

  initTerminalEvent(type: string, bubbles?: boolean, cancelable?: boolean, terminalTarget?: TerminalTarget) {
    super.initEvent(type, bubbles, cancelable);

    if (typeof terminalTarget == "object") {
      this._terminalTarget = terminalTarget;
    }
  }
}

export interface TerminalEventInit extends EventInit {
  terminalTarget?: TerminalTarget;
}
