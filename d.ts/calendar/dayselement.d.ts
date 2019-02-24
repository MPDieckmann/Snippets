/// <reference path="../../ts/default.d.ts" />
/// <reference path="../i18n/i18n.d.ts" />
/// <reference path="eventelement.d.ts" />
declare class MPCCalendarDaysElement extends HTMLElement {
    private _mpc_shadowRoot;
    constructor();
    protected _mpc_style: HTMLStyleElement;
    protected _mpc_header: Element;
    protected _mpc_body: Element;
    protected _mpc_day_map: {
        [s: string]: Element;
    };
    protected _mpc_date: Date;
    private _updating_calendar;
    updateCalendar(): void;
    private _updating_events;
    updateEvents(): void | number;
    readonly events: HTMLCollectionOf<MPCCalendarEventElement>;
    year: number;
    month: number;
    date: number;
    dayCount: number;
    static readonly observedAttributes: string[];
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
declare namespace MPCCalendarDaysElement {
    const _filter: <T>(elements: Iterable<T>, callback: (element: T) => boolean) => T[];
    function _repeat(callback: (index: number) => void, repeatCount: number, index?: number): void;
}
//# sourceMappingURL=dayselement.d.ts.map