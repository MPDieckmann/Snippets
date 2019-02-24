(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MPCTerminalElement extends HTMLElement {
        constructor() {
            super();
            this._mpc_shadowRoot = this.attachShadow({
                mode: "closed",
                delegatesFocus: false
            });
            this.$textarea = document.createElementNS("http://www.w3.org/1999/xhtml", "textarea");
            this.$history = [];
            this._historyIndex = 0;
            this._historyLength = 0;
            this._target = null;
            this._ontargetconnect = null;
            this._ontargetconnected = null;
            this._ontargetdisconnected = null;
            var div = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
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
                    this.$textarea.value = this.$textarea.value.trim();
                    if (this.$textarea.value.length == 0) {
                        return;
                    }
                    this.appendLine(this.$textarea.value, "input");
                    this.evalOnTarget(this.$textarea.value).then(r => this.appendLine(r, "output"), e => this.appendLine(e, "error"));
                    this.$history[this._historyLength++] = this.$textarea.value;
                    this.$textarea.value = "";
                    event.preventDefault();
                }
                else if (event.keyCode == 38 && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
                    this.$historyIndex--;
                }
                else if (event.keyCode == 40 && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
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
        $greeting() {
            this.clear();
            this.appendLine("MPC Terminal [Version " + MPCTerminalElement.version + "]", "log");
            this.appendLine("\u00a9 2019 MPDieckmann. All Rights Reserved.", "log");
            if (this._target) {
                this.appendLine("Connected to: " + this._target.location, "log");
            }
            else {
                this.appendLine("Not connected");
            }
            this.appendLine("", "log");
        }
        get $historyIndex() {
            return this._historyIndex;
        }
        set $historyIndex(value) {
            if (value < 0) {
                value = 0;
            }
            else if (value > this._historyLength) {
                value = this._historyLength;
            }
            if (this._historyIndex == this._historyLength) {
                this.$history[this._historyLength] = this.$textarea.value;
            }
            this._historyIndex = value;
            this.$textarea.value = this.$history[value] || "";
            this.$textarea.rows = this.$textarea.value.split("\n").length;
        }
        get value() {
            return this.$textarea.value;
        }
        clear() {
            while (this._mpc_shadowRoot.firstChild && this._mpc_shadowRoot.firstChild !== this._mpc_shadowRoot.lastChild) {
                this._mpc_shadowRoot.removeChild(this._mpc_shadowRoot.firstChild);
            }
        }
        evalOnTarget(x) {
            return new Promise((resolve, reject) => {
                if (typeof x == "string" || x instanceof String) {
                    x = x.trim();
                    if (x.length > 0) {
                        if (this._target == null) {
                            reject(new Error("mpc-terminal is not connected"));
                        }
                        else {
                            try {
                                resolve(this._target.eval.call(this._target, x));
                            }
                            catch (e) {
                                reject(e);
                            }
                        }
                    }
                }
            });
        }
        appendLine(value, type = "log") {
            var div = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
            div.classList.add("line", type);
            div.appendChild(document.createTextNode(value));
            this._mpc_shadowRoot.insertBefore(div, this._mpc_shadowRoot.lastChild);
        }
        static get observedAttributes() {
            return ["target", "ontargetconnect", "ontargetconnected", "ontargetdisconnected"];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case "target":
                    var target = self[newValue];
                    if (typeof target == "object") {
                        if ("contentWindow" in target && target.contentWindow) {
                            this.target = target.contentWindow;
                        }
                        else {
                            this.target = target;
                        }
                    }
                    break;
                case "ontargetconnect":
                    this.ontargetconnect = new Function("event", newValue);
                    break;
                case "ontargetconnected":
                    this.ontargetconnected = new Function("event", newValue);
                    break;
                case "ontargetdisconnected":
                    this.ontargetdisconnected = new Function("event", newValue);
                    break;
            }
        }
        get target() {
            return this._target;
        }
        set target(value) {
            if (this._target == value) {
                return;
            }
            var disconnectedEvent = new TerminalEvent("disconnected", {
                cancelable: false,
                terminalTarget: this._target
            });
            this.dispatchEvent(disconnectedEvent);
            if ("eval" in value &&
                "addEventListener" in value &&
                "removeEventListener" in value) {
                var connectEvent = new TerminalEvent("connect", {
                    cancelable: true,
                    terminalTarget: value
                });
                if (this.dispatchEvent(connectEvent)) {
                    this._target = value;
                    var $this = this;
                    this._target.addEventListener("unload", function onunload() {
                        $this._target.removeEventListener("unload", onunload);
                        $this.target = null;
                    });
                    this.$greeting();
                    var connectedEvent = new TerminalEvent("connected", {
                        cancelable: true,
                        terminalTarget: value
                    });
                    this.dispatchEvent(connectedEvent);
                }
            }
        }
        get ontargetconnect() {
            return this._ontargetconnect;
        }
        set ontargetconnect(value) {
            if (this._ontargetconnect == value) {
                return;
            }
            this.removeEventListener("targetconnect", value);
            this._ontargetconnect = value;
            if (value) {
                this.addEventListener("targetconnect", value);
            }
        }
        get ontargetconnected() {
            return this._ontargetconnected;
        }
        set ontargetconnected(value) {
            if (this._ontargetconnected == value) {
                return;
            }
            this.removeEventListener("targetconnected", value);
            this._ontargetconnected = value;
            if (value) {
                this.addEventListener("targetconnected", value);
            }
        }
        get ontargetdisconnected() {
            return this._ontargetdisconnected;
        }
        set ontargetdisconnected(value) {
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
    MPCTerminalElement.version = "2019.02.19";
    exports.MPCTerminalElement = MPCTerminalElement;
    customElements.define("mpc-terminal", MPCTerminalElement);
    class TerminalEvent extends Event {
        constructor(type, eventInitDict = {}) {
            super(type, eventInitDict);
            if ("terminalTarget" in eventInitDict) {
                this._terminalTarget = eventInitDict.terminalTarget;
            }
        }
        get terminalTarget() {
            return this._terminalTarget;
        }
        initTerminalEvent(type, bubbles, cancelable, terminalTarget) {
            super.initEvent(type, bubbles, cancelable);
            if (typeof terminalTarget == "object") {
                this._terminalTarget = terminalTarget;
            }
        }
    }
    exports.TerminalEvent = TerminalEvent;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybWluYWwubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvdGVybWluYWwvdGVybWluYWwubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBRUEsTUFBYSxrQkFBbUIsU0FBUSxXQUFXO1FBUWpEO1lBQ0UsS0FBSyxFQUFFLENBQUM7WUFSRixvQkFBZSxHQUFlLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3RELElBQUksRUFBRSxRQUFRO2dCQUNkLGNBQWMsRUFBRSxLQUFLO2FBQ3RCLENBQUMsQ0FBQztZQStFTyxjQUFTLEdBQTZDLFFBQVEsQ0FBQyxlQUFlLENBQUMsOEJBQThCLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFFM0gsYUFBUSxHQUFhLEVBQUUsQ0FBQztZQUMxQixrQkFBYSxHQUFXLENBQUMsQ0FBQztZQUMxQixtQkFBYyxHQUFXLENBQUMsQ0FBQztZQWlGM0IsWUFBTyxHQUFtQixJQUFJLENBQUM7WUFvRC9CLHFCQUFnQixHQUE0RCxJQUFJLENBQUM7WUFlakYsdUJBQWtCLEdBQTRELElBQUksQ0FBQztZQWVuRiwwQkFBcUIsR0FBNEQsSUFBSSxDQUFDO1lBL081RixJQUFJLEdBQUcsR0FBbUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMxRyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDbkMsR0FBRyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUM7WUFDakIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFdEMsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM5RSxLQUFLLENBQUMsV0FBVztnQkFDZixrSUFBa0k7b0JBQ2xJLDRCQUE0QjtvQkFDNUIsd05BQXdOO29C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