/// <reference path="../../ts/default.module.d.ts" />
export declare class ExtendableModule {
    element: HTMLElement;
    header: HTMLButtonElement;
    protected constructor(options: ExtendableModule.Options);
    onfocus(): void;
    onblur(): void;
}
export declare namespace ExtendableModule {
    interface Options {
        name: string;
        type: string;
    }
}
//# sourceMappingURL=extendablemodule.module.d.ts.map