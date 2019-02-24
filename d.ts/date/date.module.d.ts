/// <reference path="../../ts/default.module.d.ts" />
export declare function date(string: string, timestamp?: number | string | Date): string;
export declare namespace date {
    const weekdays: string[];
    const months: string[];
    function time(timestamp?: number | string | Date): number;
    const _functions: {
        [s: string]: (d: Date) => string | number;
    };
    function _leadingZero(value: number): string;
}
//# sourceMappingURL=date.module.d.ts.map