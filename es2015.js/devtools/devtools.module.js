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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV2dG9vbHMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvZGV2dG9vbHMvZGV2dG9vbHMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE1BQU0sa0JBQW1CLFNBQVEsV0FBVztJQUMxQztRQUNFLEtBQUssRUFBRSxDQUFDO1FBSUYsb0JBQWUsR0FBZSxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ3RELElBQUksRUFBRSxRQUFRO1lBQ2QsY0FBYyxFQUFFLEtBQUs7U0FDdEIsQ0FBQyxDQUFDO1FBQ0ssYUFBUSxHQUEwQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBUGxELElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsOEJBQThCLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQU1TLFVBQVUsQ0FBQyxNQUF3QjtRQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ1MsYUFBYSxDQUFDLE1BQXdCO1FBQzlDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDRCxJQUFXLE9BQU87UUFDaEIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBQ0Y7QUFDRCxjQUFjLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDIn0=