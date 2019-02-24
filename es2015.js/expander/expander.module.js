export class MPCExpanderElement extends HTMLElement {
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
customElements.define("mpc-expander", MPCExpanderElement);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvZXhwYW5kZXIvZXhwYW5kZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxXQUFXO0lBQ2pEO1FBQ0UsS0FBSyxFQUFFLENBQUM7UUFpSEYsY0FBUyxHQUE4QixJQUFJLENBQUM7UUEvR2xELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ3BCLE9BQU87YUFDUjtZQUNELElBQUksTUFBTSxHQUFnQixLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ3ZDLElBQUksTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3JDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNmO2lCQUFNLElBQUksTUFBTSxZQUFZLGtCQUFrQixFQUFFO2FBRWhEO2lCQUFNO2dCQUNMLE9BQU8sTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsWUFBWSxrQkFBa0IsS0FBSyxLQUFLLENBQUMsRUFBRTtvQkFDNUUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7aUJBQzVCO2dCQUNELElBQ0UsTUFBTSxDQUFDLFVBQVUsS0FBSyxJQUFJO29CQUMxQixNQUFNLENBQUMsWUFBWSxJQUFJLDhCQUE4QjtvQkFDckQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxvQkFBb0IsRUFDckQ7b0JBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDN0I7Z0JBQ0QsTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7YUFDNUI7WUFDRCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzdELElBQUksQ0FBQyxTQUFTLEdBQXVCLE1BQU0sQ0FBQztnQkFDNUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQzdDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ3ZDLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtnQkFDeEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztnQkFDeEIsSUFBSSxHQUFHLEVBQUU7b0JBQ1AsUUFBUSxLQUFLLENBQUMsT0FBTyxFQUFFO3dCQUNyQixLQUFLLEVBQUU7NEJBRUwsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO2dDQUNoQixHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7NkJBQ2hCO2lDQUFNLElBQUksR0FBRyxDQUFDLGFBQWEsWUFBWSxrQkFBa0IsRUFBRTtnQ0FDMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDOzZCQUNuQzs0QkFDRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ3ZCLE1BQU07d0JBQ1IsS0FBSyxFQUFFOzRCQUVMLElBQUksR0FBRyxDQUFDLGVBQWUsRUFBRTs2QkFFeEI7aUNBQU0sSUFBSSxHQUFHLENBQUMsc0JBQXNCLElBQUksR0FBRyxDQUFDLHNCQUFzQixZQUFZLGtCQUFrQixFQUFFO2dDQUNqRyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQzs2QkFDNUM7aUNBQU0sSUFBSSxHQUFHLENBQUMsYUFBYSxJQUFJLEdBQUcsQ0FBQyxhQUFhLFlBQVksa0JBQWtCLEVBQUU7Z0NBQy9FLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQzs2QkFDbkM7NEJBQ0QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDOzRCQUN2QixNQUFNO3dCQUNSLEtBQUssRUFBRTs0QkFFTCxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRTtnQ0FDakIsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDOzZCQUNkOzRCQUNELElBQUksQ0FBUyxDQUFDOzRCQUNkLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDOzRCQUM1QixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQ0FDdEIsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxZQUFZLGtCQUFrQixFQUFFO29DQUNqRCxJQUFJLENBQUMsUUFBUSxHQUF1QixHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUNwRCxNQUFNO2lDQUNQOzZCQUNGOzRCQUNELEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzs0QkFDdkIsTUFBTTt3QkFDUixLQUFLLEVBQUU7NEJBRUwsSUFBSSxHQUFHLENBQUMsZUFBZSxFQUFFOzZCQUV4QjtpQ0FBTSxJQUFJLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxHQUFHLENBQUMsa0JBQWtCLFlBQVksa0JBQWtCLEVBQUU7Z0NBQ3pGLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixDQUFDOzZCQUN4Qzs0QkFDRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7NEJBQ3ZCLE1BQU07cUJBQ1Q7aUJBQ0Y7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7aUJBQ3RCO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDckMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUVsQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ3BDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBVyxhQUFhO1FBQ3RCLElBQUksS0FBSyxHQUF1QixJQUFJLENBQUM7UUFDckMsT0FBTyxLQUFLLENBQUMsVUFBVSxZQUFZLGtCQUFrQixFQUFFO1lBQ3JELEtBQUssR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1NBQzFCO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsSUFBVyxlQUFlO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLFVBQVUsWUFBWSxrQkFBa0IsS0FBSyxLQUFLLENBQUM7SUFDakUsQ0FBQztJQUdELElBQVcsUUFBUTtRQUNqQixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxLQUFLLElBQUksRUFBRTtnQkFDM0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7YUFDdkI7WUFDRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDdkI7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBQ0QsSUFBVyxRQUFRLENBQUMsS0FBeUI7UUFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1NBQ3JDO2FBQU0sSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1lBQ3pCLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsS0FBSyxJQUFJLEVBQUU7Z0JBQzNELElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQzVDO1lBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDdkI7YUFBTSxJQUFJLEtBQUssWUFBWSxrQkFBa0IsRUFBRTtZQUM5QyxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEtBQUssSUFBSSxFQUFFO2dCQUMzRCxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUM1QztZQUNELEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFTSxNQUFNO1FBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUMsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxJQUFJLFdBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDcEMsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ25DLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbEMsSUFBSSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO2dCQUNyQyxVQUFVLEVBQUUsS0FBSzthQUNsQixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9CLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFDTSxRQUFRO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUMsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxJQUFJLFdBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDdEMsVUFBVSxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ25DLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbkMsSUFBSSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFO2dCQUN0QyxVQUFVLEVBQUUsS0FBSzthQUNsQixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9CLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFDTSxNQUFNLENBQUMsUUFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUTtRQUMzQyxJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQsSUFBVyxLQUFLO1FBQ2QsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsOEJBQThCLEVBQUUsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDdEcsQ0FBQztJQUNELElBQVcsU0FBUztRQUNsQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDbEQsQ0FBQztJQUNELElBQVcsU0FBUyxDQUFDLEtBQWE7UUFDaEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQzNGLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQzNDO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDekI7U0FDRjtRQUNELEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFFRCxJQUFXLFVBQVU7UUFDbkIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLElBQUksT0FBTyxDQUFDO0lBQ3ZGLENBQUM7SUFDRCxJQUFXLFVBQVUsQ0FBQyxLQUFjO1FBQ2xDLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDckM7YUFBTTtZQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBRUQsSUFBVyxRQUFRO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQ0QsSUFBVyxRQUFRLENBQUMsS0FBYztRQUNoQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxNQUFNLEtBQUssa0JBQWtCO1FBQzNCLE9BQU87WUFDTCxVQUFVO1lBQ1YsWUFBWTtZQUNaLFlBQVk7WUFDWixhQUFhO1NBQ2QsQ0FBQztJQUNKLENBQUM7SUFDRCx3QkFBd0IsQ0FBQyxJQUFZLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQjtRQUN2RSxRQUFRLElBQUksRUFBRTtZQUNaLEtBQUssVUFBVTtnQkFDYixJQUFJLENBQUMsUUFBUSxHQUFzQyxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ25GLE1BQU07WUFDUixLQUFLLFlBQVk7Z0JBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBc0MsSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUNyRixNQUFNO1lBQ1IsS0FBSyxZQUFZO2dCQUNmLElBQUksQ0FBQyxVQUFVLEdBQXNDLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDckYsTUFBTTtZQUNSLEtBQUssYUFBYTtnQkFDaEIsSUFBSSxDQUFDLFdBQVcsR0FBc0MsSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUN0RixNQUFNO1NBQ1Q7SUFDSCxDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUNELG9CQUFvQjtRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBQ0QsZUFBZTtRQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFLRCxJQUFXLFFBQVE7UUFDakIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxJQUFXLFFBQVEsQ0FBQyxLQUF3QztRQUMxRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFO1lBQzVCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUlELElBQVcsVUFBVTtRQUNuQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUNELElBQVcsVUFBVSxDQUFDLEtBQXdDO1FBQzVELElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxLQUFLLEVBQUU7WUFDOUIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBSUQsSUFBVyxVQUFVO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBQ0QsSUFBVyxVQUFVLENBQUMsS0FBd0M7UUFDNUQsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLEtBQUssRUFBRTtZQUM5QixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFJRCxJQUFXLFdBQVc7UUFDcEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFDRCxJQUFXLFdBQVcsQ0FBQyxLQUF3QztRQUM3RCxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssS0FBSyxFQUFFO1lBQy9CLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDNUMsQ0FBQztDQUVGO0FBQ0QsY0FBYyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyJ9