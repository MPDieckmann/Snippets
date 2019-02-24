/// <reference path="../default.d.ts" />

class MPCExpanderElement extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("click", event => {
      if (!this.expandable) {
        return;
      }
      var target = <Node | null>event.target;
      if (target === this && !this.expanded) {
        this.expand();
      } else if (target instanceof MPCExpanderElement) {

      } else {
        while (target && (target.parentNode instanceof MPCExpanderElement === false)) {
          target = target.parentNode;
        }
        if (
          target.parentNode === this &&
          target.namespaceURI == "http://www.w3.org/1999/xhtml" &&
          target.nodeName.toLowerCase() == "mpc-expander-label"
        ) {
          this.toggle(!this.expanded);
        }
        target = target.parentNode;
      }
      if (this.isOwnerExpander) {
        this._selected && this._selected.removeAttribute("selected");
        this._selected = <MPCExpanderElement>target;
        this._selected.setAttribute("selected", "");
      }
    });
    this.addEventListener("keydown", event => {
      if (this.isOwnerExpander) {
        var sel = this.selected;
        if (sel) {
          switch (event.keyCode) {
            case 37:
              // ArrowLeft
              if (sel.expanded) {
                sel.collapse();
              } else if (sel.parentElement instanceof MPCExpanderElement) {
                this.selected = sel.parentElement;
              }
              event.preventDefault();
              break;
            case 38:
              // ArrowUp
              if (sel.isOwnerExpander) {

              } else if (sel.previousElementSibling && sel.previousElementSibling instanceof MPCExpanderElement) {
                this.selected = sel.previousElementSibling;
              } else if (sel.parentElement && sel.parentElement instanceof MPCExpanderElement) {
                this.selected = sel.parentElement;
              }
              event.preventDefault();
              break;
            case 39:
              // ArrowRight
              if (!sel.expanded) {
                sel.expand();
              }
              var i: number;
              var l = sel.children.length;
              for (i = 0; i < l; i++) {
                if (sel.children[i] instanceof MPCExpanderElement) {
                  this.selected = <MPCExpanderElement>sel.children[i];
                  break;
                }
              }
              event.preventDefault();
              break;
            case 40:
              // ArrowDown
              if (sel.isOwnerExpander) {

              } else if (sel.nextElementSibling && sel.nextElementSibling instanceof MPCExpanderElement) {
                this.selected = sel.nextElementSibling;
              }
              event.preventDefault();
              break;
          }
        } else {
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

  public get ownerExpander() {
    var owner: MPCExpanderElement = this;
    while (owner.parentNode instanceof MPCExpanderElement) {
      owner = owner.parentNode;
    }
    return owner;
  }

  public get isOwnerExpander() {
    return this.parentNode instanceof MPCExpanderElement === false;
  }

  private _selected: MPCExpanderElement = null;
  public get selected() {
    if (this.isOwnerExpander) {
      if (this._selected && this._selected.ownerExpander !== this) {
        this._selected = null;
      }
      return this._selected;
    } else {
      return this.ownerExpander.selected;
    }
  }
  public set selected(value: MPCExpanderElement) {
    if (!this.isOwnerExpander) {
      this.ownerExpander.selected = value;
    } else if (value === null) {
      if (this._selected && this._selected.ownerExpander === this) {
        this._selected.removeAttribute("selected");
      }
      this._selected = null;
    } else if (value instanceof MPCExpanderElement) {
      if (this._selected && this._selected.ownerExpander === this) {
        this._selected.removeAttribute("selected");
      }
      value.setAttribute("selected", "");
      value.scrollIntoView();
      this._selected = value;
    }
  }

  public expand() {
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
  public collapse() {
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
  public toggle(force: boolean = !this.expanded) {
    if (force) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  public get label() {
    return this.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "mpc-expander-label")[0] || null;
  }
  public get labelText() {
    return this.label ? this.label.textContent : "";
  }
  public set labelText(value: string) {
    var label = this.label;
    if (!label) {
      var label = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-expander-label");
      if (this.firstChild) {
        this.insertBefore(label, this.firstChild);
      } else {
        this.appendChild(label);
      }
    }
    label.textContent = value;
  }

  public get expandable() {
    return this.hasAttribute("expandable") && this.getAttribute("expandable") != "false";
  }
  public set expandable(value: boolean) {
    if (value) {
      this.setAttribute("expandable", "");
    } else {
      this.removeAttribute("expandable");
    }
  }

  public get expanded() {
    return this.hasAttribute("expanded");
  }
  public set expanded(value: boolean) {
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
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "onexpand":
        this.onexpand = <(this: this, event: Event) => any>new Function("event", newValue);
        break;
      case "onexpanded":
        this.onexpanded = <(this: this, event: Event) => any>new Function("event", newValue);
        break;
      case "oncollapse":
        this.oncollapse = <(this: this, event: Event) => any>new Function("event", newValue);
        break;
      case "oncollapsed":
        this.oncollapsed = <(this: this, event: Event) => any>new Function("event", newValue);
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

  // #region Events
  // onexpand
  private _onexpand: (this: this, event: Event) => any;
  public get onexpand(): (this: this, event: Event) => any {
    return this._onexpand;
  }
  public set onexpand(value: (this: this, event: Event) => any) {
    if (this._onexpand === value) {
      return;
    }
    this.removeEventListener("expand", this._onexpand);
    this._onexpand = value;
    this.addEventListener("expand", value);
  }

  // onexpanded
  private _onexpanded: (this: this, event: Event) => any;
  public get onexpanded(): (this: this, event: Event) => any {
    return this._onexpanded;
  }
  public set onexpanded(value: (this: this, event: Event) => any) {
    if (this._onexpanded === value) {
      return;
    }
    this.removeEventListener("expanded", this._onexpanded);
    this._onexpanded = value;
    this.addEventListener("expanded", value);
  }

  // oncollapse
  private _oncollapse: (this: this, event: Event) => any;
  public get oncollapse(): (this: this, event: Event) => any {
    return this._oncollapse;
  }
  public set oncollapse(value: (this: this, event: Event) => any) {
    if (this._oncollapse === value) {
      return;
    }
    this.removeEventListener("collapse", this._oncollapse);
    this._oncollapse = value;
    this.addEventListener("collapse", value);
  }

  // oncollapsed
  private _oncollapsed: (this: this, event: Event) => any;
  public get oncollapsed(): (this: this, event: Event) => any {
    return this._oncollapsed;
  }
  public set oncollapsed(value: (this: this, event: Event) => any) {
    if (this._oncollapsed === value) {
      return;
    }
    this.removeEventListener("collapsed", this._oncollapsed);
    this._oncollapsed = value;
    this.addEventListener("collapsed", value);
  }
  // #endregion  
}
customElements.define("mpc-expander", MPCExpanderElement);
