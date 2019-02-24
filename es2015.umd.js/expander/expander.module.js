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
    class MPCExpanderElement extends HTMLElement {
        constructor() {
            super();
            this._selected = null;
            this.addEventListener("click", event => {
                if (!this.expandable) {
                    return;
                }
                var target = event.target;
                if (target === this && !this.expanded) {
                    this.expand();
                }
                else if (target instanceof MPCExpanderElement) {
                }
                else {
                    while (target && (target.parentNode instanceof MPCExpanderElement === false)) {
                        target = target.parentNode;
                    }
                    if (target.parentNode === this &&
                        target.namespaceURI == "http://www.w3.org/1999/xhtml" &&
                        target.nodeName.toLowerCase() == "mpc-expander-label") {
                        this.toggle(!this.expanded);
                    }
                    target = target.parentNode;
                }
                if (this.isOwnerExpander) {
                    this._selected && this._selected.removeAttribute("selected");
                    this._selected = target;
                    this._selected.setAttribute("selected", "");
                }
            });
            this.addEventListener("keydown", event => {
                if (this.isOwnerExpander) {
                    var sel = this.selected;
                    if (sel) {
                        switch (event.keyCode) {
                            case 37:
                                if (sel.expanded) {
                                    sel.collapse();
                                }
                                else if (sel.parentElement instanceof MPCExpanderElement) {
                                    this.selected = sel.parentElement;
                                }
                                event.preventDefault();
                                break;
                            case 38:
                                if (sel.isOwnerExpander) {
                                }
                                else if (sel.previousElementSibling && sel.previousElementSibling instanceof MPCExpanderElement) {
                                    this.selected = sel.previousElementSibling;
                                }
                                else if (sel.parentElement && sel.parentElement instanceof MPCExpanderElement) {
                                    this.selected = sel.parentElement;
                                }
                                event.preventDefault();
                                break;
                            case 39:
                                if (!sel.expanded) {
                                    sel.expand();
                                }
                                var i;
                                var l = sel.children.length;
                                for (i = 0; i < l; i++) {
                                    if (sel.children[i] instanceof MPCExpanderElement) {
                                        this.selected = sel.children[i];
                                        break;
                                    }
                                }
                                event.preventDefault();
                                break;
                            case 40:
                                if (sel.isOwnerExpander) {
                                }
                                else if (sel.nextElementSibling && sel.nextElementSibling instanceof MPCExpanderElement) {
                                    this.selected = sel.nextElementSibling;
                                }
                                event.preventDefault();
                                break;
                        }
                    }
                    else {
                        this.selected = this;
                    }
                }
            });
            this.addEventListener("focus", event => {
                this.ownerExpander.setAttribute("focus", "");
            });
            this.addEventListener("blur", event => {
                this.ownerExpander.removeAttribute("focus");
            });
            this.expandable = this.expandable;
            setTimeout(() => {
                if (!this.expanded) {
                    this.setAttribute("collapsed", "");
                }
            });
        }
        get ownerExpander() {
            var owner = this;
            while (owner.parentNode instanceof MPCExpanderElement) {
                owner = owner.parentNode;
            }
            return owner;
        }
        get isOwnerExpander() {
            return this.parentNode instanceof MPCExpanderElement === false;
        }
        get selected() {
            if (this.isOwnerExpander) {
                if (this._selected && this._selected.ownerExpander !== this) {
                    this._selected = null;
                }
                return this._selected;
            }
            else {
                return this.ownerExpander.selected;
            }
        }
        set selected(value) {
            if (!this.isOwnerExpander) {
                this.ownerExpander.selected = value;
            }
            else if (value === null) {
                if (this._selected && this._selected.ownerExpander === this) {
                    this._selected.removeAttribute("selected");
                }
                this._selected = null;
            }
            else if (value instanceof MPCExpanderElement) {
                if (this._selected && this._selected.ownerExpander === this) {
                    this._selected.removeAttribute("selected");
                }
                value.setAttribute("selected", "");
                value.scrollIntoView();
                this._selected = value;
            }
        }
        expand() {
            if (!this.expandable) {
                return false;
            }
            var value = this.getAttribute("expanded");
            if (value != null) {
                return true;
            }
            var beforeEvent = new Event("expand", {
                cancelable: true
            });
            if (this.dispatchEvent(beforeEvent)) {
                this.setAttribute("expanded", "");
                this.removeAttribute("collapsed");
                var afterEvent = new Event("expanded", {
                    cancelable: false
                });
                this.dispatchEvent(afterEvent);
                return true;
            }
            return false;
        }
        collapse() {
            if (!this.expandable) {
                return false;
            }
            var value = this.getAttribute("expanded");
            if (value == null) {
                return true;
            }
            var beforeEvent = new Event("collapse", {
                cancelable: true
            });
            if (this.dispatchEvent(beforeEvent)) {
                this.removeAttribute("expanded");
                this.setAttribute("collapsed", "");
                var afterEvent = new Event("collapsed", {
                    cancelable: false
                });
                this.dispatchEvent(afterEvent);
                return true;
            }
            return false;
        }
        toggle(force = !this.expanded) {
            if (force) {
                this.expand();
            }
            else {
                this.collapse();
            }
        }
        get label() {
            return this.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "mpc-expander-label")[0] || null;
        }
        get labelText() {
            return this.label ? this.label.textContent : "";
        }
        set labelText(value) {
            var label = this.label;
            if (!label) {
                var label = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-expander-label");
                if (this.firstChild) {
                    this.insertBefore(label, this.firstChild);
                }
                else {
                    this.appendChild(label);
                }
            }
            label.textContent = value;
        }
        get expandable() {
            return this.hasAttribute("expandable") && this.getAttribute("expandable") != "false";
        }
        set expandable(value) {
            if (value) {
                this.setAttribute("expandable", "");
            }
            else {
                this.removeAttribute("expandable");
            }
        }
        get expanded() {
            return this.hasAttribute("expanded");
        }
        set expanded(value) {
            this.toggle(value);
        }
        static get observedAttributes() {
            return [
                "onexpand",
                "onexpanded",
                "oncollapse",
                "oncollapsed"
            ];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
                case "onexpand":
                    this.onexpand = new Function("event", newValue);
                    break;
                case "onexpanded":
                    this.onexpanded = new Function("event", newValue);
                    break;
                case "oncollapse":
                    this.oncollapse = new Function("event", newValue);
                    break;
                case "oncollapsed":
                    this.oncollapsed = new Function("event", newValue);
                    break;
            }
        }
        connectedCallback() {
            this.tabIndex = this.isOwnerExpander ? 0 : -1;
            this.removeAttribute("selected");
        }
        disconnectedCallback() {
            this.tabIndex = this.isOwnerExpander ? 0 : -1;
            this.removeAttribute("selected");
        }
        adoptedCallback() {
            this.tabIndex = this.isOwnerExpander ? 0 : -1;
            this.removeAttribute("selected");
        }
        get onexpand() {
            return this._onexpand;
        }
        set onexpand(value) {
            if (this._onexpand === value) {
                return;
            }
            this.removeEventListener("expand", this._onexpand);
            this._onexpand = value;
            this.addEventListener("expand", value);
        }
        get onexpanded() {
            return this._onexpanded;
        }
        set onexpanded(value) {
            if (this._onexpanded === value) {
                return;
            }
            this.removeEventListener("expanded", this._onexpanded);
            this._onexpanded = value;
            this.addEventListener("expanded", value);
        }
        get oncollapse() {
            return this._oncollapse;
        }
        set oncollapse(value) {
            if (this._oncollapse === value) {
                return;
            }
            this.removeEventListener("collapse", this._oncollapse);
            this._oncollapse = value;
            this.addEventListener("collapse", value);
        }
        get oncollapsed() {
            return this._oncollapsed;
        }
        set oncollapsed(value) {
            if (this._oncollapsed === value) {
                return;
            }
            this.removeEventListener("collapsed", this._oncollapsed);
            this._oncollapsed = value;
            this.addEventListener("collapsed", value);
        }
    }
    exports.MPCExpanderElement = MPCExpanderElement;
    customElements.define("mpc-expander", MPCExpanderElement);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvZXhwYW5kZXIvZXhwYW5kZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBRUEsTUFBYSxrQkFBbUIsU0FBUSxXQUFXO1FBQ2pEO1lBQ0UsS0FBSyxFQUFFLENBQUM7WUFpSEYsY0FBUyxHQUE4QixJQUFJLENBQUM7WUEvR2xELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ3JDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNwQixPQUFPO2lCQUNSO2dCQUNELElBQUksTUFBTSxHQUFnQixLQUFLLENBQUMsTUFBTSxDQUFDO2dCQUN2QyxJQUFJLE1BQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNyQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ2Y7cUJBQU0sSUFBSSxNQUFNLFlBQVksa0JBQWtCLEVBQUU7aUJBRWhEO3FCQUFNO29CQUNMLE9BQU8sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsWUFBWSxrQkFBa0IsS0FBSyxLQUFLLENBQUMsRUFBRTt3QkFDNUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7cUJBQzVCO29CQUNELElBQ0UsTUFBTSxDQUFDLFVBQVUsS0FBSyxJQUFJO3dCQUMxQixNQUFNLENBQUMsWUFBWSxJQUFJLDhCQUE4Qjt3QkFDckQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxvQkFBb0IsRUFDckQ7d0JBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztxQkFDN0I7b0JBQ0QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7aUJBQzVCO2dCQUNELElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDeEIs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