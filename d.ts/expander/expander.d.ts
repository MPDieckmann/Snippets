/// <reference path="../../ts/default.d.ts" />
declare class MPCExpanderElement extends HTMLElement {
    constructor();
    readonly ownerExpander: MPCExpanderElement;
    readonly isOwnerExpander: boolean;
    private _selected;
    selected: MPCExpanderElement;
    expand(): boolean;
    collapse(): boolean;
    toggle(force?: boolean): void;
    readonly label: HTMLElement;
    labelText: string;
    expandable: boolean;
    expanded: boolean;
    static readonly observedAttributes: string[];
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    adoptedCallback(): void;
    private _onexpand;
    onexpand: (this: this, event: Event) => any;
    private _onexpanded;
    onexpanded: (this: this, event: Event) => any;
    private _oncollapse;
    oncollapse: (this: this, event: Event) => any;
    private _oncollapsed;
    oncollapsed: (this: this, event: Event) => any;
}
//# sourceMappingURL=expander.d.ts.map