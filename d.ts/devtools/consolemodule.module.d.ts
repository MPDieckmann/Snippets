/// <reference path="../../ts/default.module.d.ts" />
import { ExtendableModule } from './extendablemodule.module';
export declare class ConsoleModule extends ExtendableModule implements ConsoleModule.ConsoleFunctions {
    protected $functions: (keyof ConsoleModule.ConsoleFunctions)[];
    private _console;
    readonly target: (Window & {
        eval(code: string): any;
        Node: {
            new (): Node;
        };
    }) | null;
    constructor(target?: Window | null);
    protected $textarea: HTMLTextAreaElement;
    protected $history: string[];
    private _historyIndex;
    private _historyLength;
    protected $historyIndex: number;
    protected $lines: Element;
    protected $output: Element;
    protected $eval(code: string): any;
    protected $toString(value: any): string;
    protected $createLine(args: IArguments | any[], type?: string): HTMLElement;
    protected $clear(): void;
    assert(test: boolean, message?: any, ...optionalParams: any[]): void;
    clear(): void;
    protected $counter: {
        [s: string]: number;
    };
    count(countTitle?: string): void;
    debug(message?: any, ...optionalParams: any[]): void;
    dir(value: any): void;
    dirxml(value: any): void;
    error(message?: any, ...optionalParams: any[]): void;
    protected $groups: Element[];
    group(groupTitle?: string, ...optionalParams: any[]): void;
    groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void;
    groupEnd(): void;
    info(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    protected $timer: {
        [s: string]: number;
    };
    time(timerName?: string): void;
    timeEnd(timerName?: string): void;
    warn(message?: any, ...optionalParams: any[]): void;
    preserveLog: boolean;
    bind(target: Window | null): void;
    private _errorListener;
}
export declare namespace ConsoleModule {
    type ConsoleFunctions = {
        assert(test: boolean, message?: any, ...optionalParams: any[]): void;
        clear(): void;
        count(countTitle?: string): void;
        debug(message?: any, ...optionalParams: any[]): void;
        dir(value: any): void;
        dirxml(value: any): void;
        error(message?: any, ...optionalParams: any[]): void;
        group(groupTitle?: string, ...optionalParams: any[]): void;
        groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void;
        groupEnd(): void;
        info(message?: any, ...optionalParams: any[]): void;
        log(message?: any, ...optionalParams: any[]): void;
        time(timerName?: string): void;
        timeEnd(timerName?: string): void;
        warn(message?: any, ...optionalParams: any[]): void;
    };
}
//# sourceMappingURL=consolemodule.module.d.ts.map