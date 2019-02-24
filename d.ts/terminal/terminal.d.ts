/// <reference path="../../ts/default.d.ts" />
declare class MPCTerminalElement extends HTMLElement {
    private _mpc_shadowRoot;
    static readonly version: string;
    constructor();
    protected $greeting(): void;
    protected $textarea: HTMLTextAreaElement;
    protected $history: string[];
    private _historyIndex;
    private _historyLength;
    protected $historyIndex: number;
    readonly value: string;
    clear(): void;
    evalOnTarget(x: string | String): Promise<{}>;
    appendLine(value: any, type?: "input" | "output" | "log" | "warn" | "error"): void;
    static readonly observedAttributes: string[];
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    private _target;
    target: TerminalTarget;
    private _ontargetconnect;
    ontargetconnect: (this: MPCTerminalElement, event: TerminalEvent) => any;
    private _ontargetconnected;
    ontargetconnected: (this: MPCTerminalElement, event: TerminalEvent) => any;
    private _ontargetdisconnected;
    ontargetdisconnected: (this: MPCTerminalElement, event: TerminalEvent) => any;
}
interface TerminalTarget extends EventTarget {
    eval(x: string): any;
    location: Location;
}
declare class TerminalEvent extends Event {
    constructor(type: string, eventInitDict?: TerminalEventInit);
    private _terminalTarget;
    readonly terminalTarget: TerminalTarget;
    initTerminalEvent(type: string, bubbles?: boolean, cancelable?: boolean, terminalTarget?: TerminalTarget): void;
}
interface TerminalEventInit extends EventInit {
    terminalTarget?: TerminalTarget;
}
//# sourceMappingURL=terminal.d.ts.map