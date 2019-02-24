"use strict";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVybWluYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy90ZXJtaW5hbC90ZXJtaW5hbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsTUFBTSxrQkFBbUIsU0FBUSxXQUFXO0lBUTFDO1FBQ0UsS0FBSyxFQUFFLENBQUM7UUFSRixvQkFBZSxHQUFlLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDdEQsSUFBSSxFQUFFLFFBQVE7WUFDZCxjQUFjLEVBQUUsS0FBSztTQUN0QixDQUFDLENBQUM7UUErRU8sY0FBUyxHQUE2QyxRQUFRLENBQUMsZUFBZSxDQUFDLDhCQUE4QixFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRTNILGFBQVEsR0FBYSxFQUFFLENBQUM7UUFDMUIsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsbUJBQWMsR0FBVyxDQUFDLENBQUM7UUFpRjNCLFlBQU8sR0FBbUIsSUFBSSxDQUFDO1FBb0QvQixxQkFBZ0IsR0FBNEQsSUFBSSxDQUFDO1FBZWpGLHVCQUFrQixHQUE0RCxJQUFJLENBQUM7UUFlbkYsMEJBQXFCLEdBQTRELElBQUksQ0FBQztRQS9PNUYsSUFBSSxHQUFHLEdBQW1DLFFBQVEsQ0FBQyxlQUFlLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25DLEdBQUcsQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXRDLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsOEJBQThCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDOUUsS0FBSyxDQUFDLFdBQVc7WUFDZixrSUFBa0k7Z0JBQ2xJLDRCQUE0QjtnQkFDNUIsd05BQXdOO2dCQUN4Tix1RkFBdUY7Z0JBQ3ZGLDJJQUEySTtn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