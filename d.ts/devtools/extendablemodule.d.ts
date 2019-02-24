/// <reference path="../../ts/default.d.ts" />
declare class ExtendableModule {
    element: HTMLElement;
    header: HTMLButtonElement;
    protected constructor(options: ExtendableModule.Options);
    onfocus(): void;
    onblur(): void;
}
declare namespace ExtendableModule {
    interface Options {
        name: string;
        type: string;
    }
}
//# sourceMappingURL=extendablemodule.d.ts.map