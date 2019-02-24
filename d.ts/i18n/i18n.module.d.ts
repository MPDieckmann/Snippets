/// <reference path="../../ts/default.module.d.ts" />
export declare function i18n(text: string, namespace?: string, ...args: string[]): string;
export declare namespace i18n {
    const _namespaces: {
        [n: string]: {
            [s: string]: string;
        };
    };
    function defineNamespace(namespace: string, translations: {
        [s: string]: string;
    }): void;
    function opt(value: number, opt0: string, opt1: string, optN: string, namespace?: string): string;
}
//# sourceMappingURL=i18n.module.d.ts.map