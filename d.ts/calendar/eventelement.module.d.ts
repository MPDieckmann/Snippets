/// <reference path="../../ts/default.module.d.ts" />
export declare class MPCCalendarEventElement extends HTMLElement {
    constructor();
    text: string;
    outline: boolean;
    color: string;
    begin: string;
    end: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    adoptedCallback(): void;
    static readonly observedAttributes: string[];
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
//# sourceMappingURL=eventelement.module.d.ts.map