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
    class MPCDevtoolsElement extends HTMLElement {
        constructor() {
            super();
            this._mpc_shadowRoot = this.attachShadow({
                mode: "closed",
                delegatesFocus: false
            });
            this._modules = new Set();
            var header = document.createElementNS("http://www.w3.org/1999/xhtml", "header");
            this._mpc_shadowRoot.appendChild(header);
        }
        $addModule(module) {
            this._modules.delete(module);
            this._modules.add(module);
        }
        $removeModule(module) {
            this._modules.delete(module);
        }
        get modules() {
            return Array.from(this._modules);
        }
    }
    customElements.define("mpc-devtools", MPCDevtoolsElement);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvZGV2dG9vbHMvZGV2dG9vbHMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBSUEsTUFBTSxrQkFBbUIsU0FBUSxXQUFXO1FBQzFDO1lBQ0UsS0FBSyxFQUFFLENBQUM7WUFJRixvQkFBZSxHQUFlLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3RELElBQUksRUFBRSxRQUFRO2dCQUNkLGNBQWMsRUFBRSxLQUFLO2FBQ3RCLENBQUMsQ0FBQztZQUNLLGFBQVEsR0FBMEIsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQVBsRCxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLDhCQUE4QixFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hGLElBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFNUyxVQUFVLENBQUMsTUFBd0I7WUFDM0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUNTLGFBQWEsQ0FBQyxNQUF3QjtZQUM5QyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMvQixDQUFDO1FBQ0QsSUFBVyxPQUFPO1lBQ2hCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkMsQ0FBQztLQUNGO0lBQ0QsY0FBYyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyJ9