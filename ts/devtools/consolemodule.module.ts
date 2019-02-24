/// <reference path="../default.module.d.ts" />

import { ExtendableModule } from './extendablemodule.module';
import { MPCExpanderElement } from '../expander/expander.module';
import { MPCPropertyExpanderElement } from '../expander/propertyexpander.module';
import { MPCNodeExpanderElement } from '../expander/nodeexpander.module';

export class ConsoleModule extends ExtendableModule implements ConsoleModule.ConsoleFunctions {
  protected $functions: (keyof ConsoleModule.ConsoleFunctions)[] = [
    "assert",
    "clear",
    "count",
    "debug",
    "dir",
    "dirxml",
    "error",
    "group",
    "groupCollapsed",
    "groupEnd",
    "info",
    "log",
    "time",
    "timeEnd",
    "warn"
  ];
  private _console: Console | null = null;
  public readonly target: (Window & {
    eval(code: string): any;
    Node: { new(): Node };
  }) | null = null;
  constructor(target: Window | null = null) {
    super({
      name: "Console",
      type: "console"
    });

    this._console;

    this.element.appendChild(this.$lines);
    var $input = document.createElement("input-line");
    this.element.appendChild($input);

    this.$textarea.rows = 1;
    this.$textarea.addEventListener("keydown", event => {
      if (event.keyCode == 13 && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
        // Enter (no shiftKey, no altKey, no ctrlKey, no metaKey)
        var value = this.$textarea.value.trim();
        if (value != "") {
          try {
            var line = document.createElement("line");
            line.setAttribute("type", "input");
            line.textContent = value;
            this.$output.appendChild(line);

            this.$createLine([this.$eval(value)], "output");
            this.$textarea.value = "";
          } catch (e) {
            this.$createLine(["Uncaught:", e], "error");
          }
        }
        this.$history[this._historyLength++] = this.$textarea.value;
        this.$historyIndex = this._historyLength;
        this.$textarea.value = "";
        event.preventDefault();
      } else if (event.keyCode == 38 && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
        // ArrowUp (no shiftKey, no altKey, no ctrlKey, no metaKey)
        this.$historyIndex--;
      } else if (event.keyCode == 40 && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
        // ArrowDown (no shiftKey, no altKey, no ctrlKey, no metaKey)
        this.$historyIndex++;
      } else if (event.keyCode == 76 && !event.shiftKey && !event.altKey && event.ctrlKey && !event.metaKey) {
        // Control + KeyL (no shiftKey, no altKey, no metaKey)
        this.$clear();
      }

      this.$textarea.rows = this.$textarea.value.split("\n").length;
    });
    this.$textarea.addEventListener("keypress", () => {
      this.$textarea.rows = this.$textarea.value.split("\n").length;
    });
    this.$textarea.addEventListener("keyup", () => {
      this.$textarea.rows = this.$textarea.value.split("\n").length;
    });
    this.$textarea.addEventListener("paste", () => {
      this.$textarea.rows = this.$textarea.value.split("\n").length;
    });
    $input.appendChild(this.$textarea);

    this.bind(target);
  }
  protected $textarea: HTMLTextAreaElement = document.createElement("textarea");
  protected $history: string[] = [];
  private _historyIndex: number = 0;
  private _historyLength: number = 0;
  protected get $historyIndex(): number {
    return this._historyIndex;
  }
  protected set $historyIndex(value: number) {
    if (value < 0) {
      value = 0;
    } else if (value > this._historyLength) {
      value = this._historyLength;
    }
    if (this._historyIndex == this._historyLength) {
      this.$history[this._historyLength] = this.$textarea.value;
    }
    this._historyIndex = value;
    this.$textarea.value = this.$history[value] || "";
    this.$textarea.rows = this.$textarea.value.split("\n").length;
  }
  protected $lines: Element = document.createElement("lines");
  protected $output: Element = this.$lines;
  protected $eval(code: string) {
    if (this.target) {
      return this.target.eval.call(null, code);
    } else {
      this.$createLine(["Failed to evaluate '%s': console is not linked to a window", code], "error");
      return null;
    }
  }
  protected $toString(value: any): string {
    switch (typeof value) {
      case "boolean":
      case "function":
      case "number":
      case "string":
      case "symbol":
        return value.toString();
      case "object":
        if (value === null) {
          return "null";
        }
        if ("toString" in value && typeof value.toString == "function") {
          return value.toString();
        }
        return Object.prototype.toString.call(value);
      case "undefined":
        return "undefined";
    }
    throw "Error: cannot convert to string";
  }
  protected $createLine(args: IArguments | any[], type?: string) {
    var line = document.createElement("line");
    var index = 0;
    var length = args.length;
    if (typeof args[0] == "string") {
      var regexp = /%[sidfoOc]/;
      var tmp: HTMLElement = line;
      var expander: MPCNodeExpanderElement<Node> | MPCPropertyExpanderElement<any>;
      index++;
      (<string>args[0]).split(/(%[sidfoOc])/).forEach(str => {
        if (regexp.test(str) && index < length) {
          switch (str) {
            case "%s":
              expander = <MPCPropertyExpanderElement<any>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
              expander.property = this.$toString(args[index++]);
              tmp.appendChild(expander);
              break;
            case "%i":
            case "%d":
              expander = <MPCPropertyExpanderElement<any>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
              expander.property = parseInt(this.$toString(args[index++]));
              tmp.appendChild(expander);
              break;
            case "%f":
              expander = <MPCPropertyExpanderElement<any>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
              expander.property = parseFloat(this.$toString(args[index++]));
              tmp.appendChild(expander);
              break;
            case "%o":
              if (this.target && typeof args[index] == "object" && args[index] instanceof this.target.Node) {
                expander = <MPCNodeExpanderElement<Node>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander");
                expander.node = args[index++];
                tmp.appendChild(expander);
                break;
              }
            case "%O":
              expander = <MPCPropertyExpanderElement<any>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
              expander.property = args[index++];
              tmp.appendChild(expander);
              break;
            case "%c":
              let tmp2 = document.createElement("font");
              tmp2.setAttribute("style", args[index++]);
              tmp.appendChild(tmp2);
              tmp = tmp2;
              break;
          }
        } else {
          tmp.appendChild(document.createTextNode(str));
        }
      });
    }
    for (index; index < length; index++) {
      if (typeof args[index] == "string") {
        line.appendChild(document.createTextNode(" " + args[index]));
      } else if (this.target && typeof args[index] == "object" && args[index] instanceof this.target.Node) {
        expander = <MPCNodeExpanderElement<Node>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander");
        expander.node = args[index];
        line.appendChild(expander);
      } else {
        expander = <MPCPropertyExpanderElement<any>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander");
        expander.property = args[index];
        line.appendChild(expander);
      }
    }
    if (type) {
      line.setAttribute("type", type);
    }
    this.$output.appendChild(line);
    return line;
  }
  protected $clear() {
    while (this.$lines.firstChild) {
      this.$lines.removeChild(this.$lines.firstChild);
    }
    this.$output = this.$lines;
  }
  public assert(test: boolean, message?: any, ...optionalParams: any[]) {
    if (test) {
      optionalParams.unshift(message);
      if (typeof message == "string") {
        optionalParams[0] = "Assertion Failed: " + optionalParams[0];
      } else {
        optionalParams.unshift("Assertion Failed");
      }
      this.$createLine(optionalParams, "error");
    }
  }
  public clear() {
    this.$clear();
    this.$createLine(["%cConsole was cleared", "font-style:italic;color:#888;"]);
  }
  protected $counter: { [s: string]: number } = {};
  public count(countTitle?: string) {
    var $countTitle = "$" + countTitle;
    if ($countTitle in this.$counter === false) {
      this.$counter[$countTitle] = 0;
    }
    if (countTitle) {
      this.log(countTitle, ++this.$counter[$countTitle]);
    } else {
      this.log(++this.$counter[$countTitle]);
    }
  }
  public debug(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "debug");
  }
  public dir(value: any) {
    this.$createLine(["%O", value], "dir");
  }
  public dirxml(value: any) {
    this.$createLine(["%o", value], "dirxml");
  }
  public error(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "error");
  }
  protected $groups: Element[] = [];
  public group(groupTitle?: string, ...optionalParams: any[]) {
    var expander = <MPCExpanderElement>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-expander");
    expander.labelText = "";
    expander.expandable = true;
    expander.setAttribute("type", "lines-expander");
    var line = this.$createLine(arguments.length > 0 ? arguments : ["console.group"], "group");
    while (line.firstChild) {
      expander.label.appendChild(line.firstChild);
    }
    expander.expand();
    this.$groups.push(this.$output);
    line.parentElement.replaceChild(expander, line);
    this.$output = expander;
  }
  public groupCollapsed(groupTitle?: string, ...optionalParams: any[]) {
    var expander = <MPCExpanderElement>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-expander");
    expander.labelText = "";
    expander.expandable = true;
    expander.setAttribute("type", "lines-expander");
    var line = this.$createLine(arguments.length > 0 ? arguments : ["console.groupCollapsed"], "group");
    while (line.firstChild) {
      expander.appendChild(line.firstChild);
    }
    this.$groups.push(this.$output);
    line.parentElement.replaceChild(expander, line);
    this.$output = expander;
  }
  public groupEnd() {
    if (0 in this.$groups) {
      this.$output = <Element>this.$groups.pop();
    }
  }
  public info(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "info");
  }
  public log(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "log");
  }
  protected $timer: { [s: string]: number } = {};
  public time(timerName?: string) {
    var $timerName = "$" + timerName;
    if ($timerName in this.$timer === false) {
      this.$timer[$timerName] = Date.now();
    }
  }
  public timeEnd(timerName?: string) {
    var $timerName = "$" + timerName;
    var $time = 0;
    if ($timerName in this.$timer) {
      $time = Date.now() - this.$timer[$timerName];
      delete this.$timer[$timerName];
    }
    this.log("%s: %fms", timerName || "default", $time);
  }
  public warn(message?: any, ...optionalParams: any[]) {
    this.$createLine(arguments, "warn");
  }
  public preserveLog: boolean = false;
  public bind(target: Window | null) {
    if (this.target) {
      this.target.removeEventListener && this.target.removeEventListener("error", this._errorListener);
      this.$createLine(["%cNavigated to %s", "color:#00f;", this.target.location], "log");
      if (!this.preserveLog) {
        this.$clear();
      }
    }

    (<{ target: any }>this).target = target;

    if (this.target) {
      this.target.addEventListener("error", this._errorListener);

      const $this = this;
      try {
        (<{ console: Console }>this.target).console = this._console = new Proxy(this.target.console, {
          get($target: Console, p: keyof ConsoleModule.ConsoleFunctions): any {
            if (p in $target === false) {
              return;
            }
            if ($this.target === target && $this.$functions.indexOf(p) >= 0 && p in $this) {
              return () => {
                (<any>$this[p]).apply($this, arguments);
                return (<any>$target[p]).apply($target, arguments);
              }
            }
            return $target[p];
          }
        });
      } catch (e) {
        this.error(e);
      }
    }
  }
  private _errorListener = ((event: ErrorEvent) => {
    try {
      var args = ["Uncaught: %s\n%o\n\tat %s (%i)", event.message, event.error, event.filename, event.lineno];
      if ("colno" in event) {
        args[0] = "Uncaught: %s\n%o\n\tat %s (%i:%i)";
        args.push(event.colno);
      }
      this.$createLine(args, "error");
    } catch (e) {
      this.$createLine(["Uncaught:", e], "error");
    }
  }).bind(this);
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
  }
}