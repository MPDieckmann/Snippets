/// <reference path="../../ts/default.d.ts" />
/// <reference path="../i18n/i18n.d.ts" />
declare var i18n: (text: string) => string;
declare function date(string: string, timestamp?: number | string | Date): string;
declare namespace date {
    const weekdays: string[];
    const months: string[];
    function time(timestamp?: number | string | Date): number;
    const _functions: {
        [s: string]: (d: Date) => string | number;
    };
    function _leadingZero(value: number): string;
}
//# sourceMappingURL=date.d.ts.map