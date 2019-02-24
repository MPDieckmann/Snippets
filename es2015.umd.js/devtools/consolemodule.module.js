(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./extendablemodule.module"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const extendablemodule_module_1 = require("./extendablemodule.module");
    class ConsoleModule extends extendablemodule_module_1.ExtendableModule {
        constructor(target = null) {
            super({
                name: "Console",
                type: "console"
            });
            this.$functions = [
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
            this._console = null;
            this.target = null;
            this.$textarea = document.createElement("textarea");
            this.$history = [];
            this._historyIndex = 0;
            this._historyLength = 0;
            this.$lines = document.createElement("lines");
            this.$output = this.$lines;
            this.$counter = {};
            this.$groups = [];
            this.$timer = {};
            this.preserveLog = false;
            this._errorListener = ((event) => {
                try {
                    var args = ["Uncaught: %s\n%o\n\tat %s (%i)", event.message, event.error, event.filename, event.lineno];
                    if ("colno" in event) {
                        args[0] = "Uncaught: %s\n%o\n\tat %s (%i:%i)";
                        args.push(event.colno);
                    }
                    this.$createLine(args, "error");
                }
                catch (e) {
                    this.$createLine(["Uncaught:", e], "error");
                }
            }).bind(this);
            this._console;
            this.element.appendChild(this.$lines);
            var $input = document.createElement("input-line");
            this.element.appendChild($input);
            this.$textarea.rows = 1;
            this.$textarea.addEventListener("keydown", event => {
                if (event.keyCode == 13 && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
                    var value = this.$textarea.value.trim();
                    if (value != "") {
                        try {
                            var line = document.createElement("line");
                            line.setAttribute("type", "input");
                            line.textContent = value;
                            this.$output.appendChild(line);
                            this.$createLine([this.$eval(value)], "output");
                            this.$textarea.value = "";
                        }
                        catch (e) {
                            this.$createLine(["Uncaught:", e], "error");
                        }
                    }
                    this.$history[this._historyLength++] = this.$textarea.value;
                    this.$historyIndex = this._historyLength;
                    this.$textarea.value = "";
                    event.preventDefault();
                }
                else if (event.keyCode == 38 && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
                    this.$historyIndex--;
                }
                else if (event.keyCode == 40 && !event.shiftKey && !event.altKey && !event.ctrlKey && !event.metaKey) {
                    this.$historyIndex++;
                }
                else if (event.keyCode == 76 && !event.shiftKey && !event.altKey && event.ctrlKey && !event.metaKey) {
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
        get $historyIndex() {
            return this._historyIndex;
        }
        set $historyIndex(value) {
            if (value < 0) {
                value = 0;
            }
            else if (value > this._historyLength) {
                value = this._historyLength;
            }
            if (this._historyIndex == this._historyLength) {
                this.$history[this._historyLength] = this.$textarea.value;
            }
            this._historyIndex = value;
            this.$textarea.value = this.$history[value] || "";
            this.$textarea.rows = this.$textarea.value.split("\n").length;
        }
        $eval(code) {
            if (this.target) {
                return this.target.eval.call(null, code);
            }
            else {
                this.$createLine(["Failed to evaluate '%s': console is not linked to a window", code], "error");
                return null;
            }
        }
        $toString(value) {
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
        $createLine(args, type) {
            var line = document.createElement("line");
            var index = 0;
            var length = args.length;
            if (typeof args[0] == "string") {
                var regexp = /%[sidfoOc]/;
                var tmp = line;
                var expander;
                index++;
                args[0].split(/(%[sidfoOc])/).forEach(str => {
                    if (regexp.test(str) && index < length) {
                        switch (str) {
                            case "%s":
                                expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
                                expander.property = this.$toString(args[index++]);
                                tmp.appendChild(expander);
                                break;
                            case "%i":
                            case "%d":
                                expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
                                expander.property = parseInt(this.$toString(args[index++]));
                                tmp.appendChild(expander);
                                break;
                            case "%f":
                                expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
                                expander.property = parseFloat(this.$toString(args[index++]));
                                tmp.appendChild(expander);
                                break;
                            case "%o":
                                if (this.target && typeof args[index] == "object" && args[index] instanceof this.target.Node) {
                                    expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander");
                                    expander.node = args[index++];
                                    tmp.appendChild(expander);
                                    break;
                                }
                            case "%O":
                                expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
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
                    }
                    else {
                        tmp.appendChild(document.createTextNode(str));
                    }
                });
            }
            for (index; index < length; index++) {
                if (typeof args[index] == "string") {
                    line.appendChild(document.createTextNode(" " + args[index]));
                }
                else if (this.target && typeof args[index] == "object" && args[index] instanceof this.target.Node) {
                    expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander");
                    expander.node = args[index];
                    line.appendChild(expander);
                }
                else {
                    expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander");
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
        $clear() {
            while (this.$lines.firstChild) {
                this.$lines.removeChild(this.$lines.firstChild);
            }
            this.$output = this.$lines;
        }
        assert(test, message, ...optionalParams) {
            if (test) {
                optionalParams.unshift(message);
                if (typeof message == "string") {
                    optionalParams[0] = "Assertion Failed: " + optionalParams[0];
                }
                else {
                    optionalParams.unshift("Assertion Failed");
                }
                this.$createLine(optionalParams, "error");
            }
        }
        clear() {
            this.$clear();
            this.$createLine(["%cConsole was cleared", "font-style:italic;color:#888;"]);
        }
        count(countTitle) {
            var $countTitle = "$" + countTitle;
            if ($countTitle in this.$counter === false) {
                this.$counter[$countTitle] = 0;
            }
            if (countTitle) {
                this.log(countTitle, ++this.$counter[$countTitle]);
            }
            else {
                this.log(++this.$counter[$countTitle]);
            }
        }
        debug(message, ...optionalParams) {
            this.$createLine(arguments, "debug");
        }
        dir(value) {
            this.$createLine(["%O", value], "dir");
        }
        dirxml(value) {
            this.$createLine(["%o", value], "dirxml");
        }
        error(message, ...optionalParams) {
            this.$createLine(arguments, "error");
        }
        group(groupTitle, ...optionalParams) {
            var expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-expander");
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
        groupCollapsed(groupTitle, ...optionalParams) {
            var expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-expander");
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
        groupEnd() {
            if (0 in this.$groups) {
                this.$output = this.$groups.pop();
            }
        }
        info(message, ...optionalParams) {
            this.$createLine(arguments, "info");
        }
        log(message, ...optionalParams) {
            this.$createLine(arguments, "log");
        }
        time(timerName) {
            var $timerName = "$" + timerName;
            if ($timerName in this.$timer === false) {
                this.$timer[$timerName] = Date.now();
            }
        }
        timeEnd(timerName) {
            var $timerName = "$" + timerName;
            var $time = 0;
            if ($timerName in this.$timer) {
                $time = Date.now() - this.$timer[$timerName];
                delete this.$timer[$timerName];
            }
            this.log("%s: %fms", timerName || "default", $time);
        }
        warn(message, ...optionalParams) {
            this.$createLine(arguments, "warn");
        }
        bind(target) {
            if (this.target) {
                this.target.removeEventListener && this.target.removeEventListener("error", this._errorListener);
                this.$createLine(["%cNavigated to %s", "color:#00f;", this.target.location], "log");
                if (!this.preserveLog) {
                    this.$clear();
                }
            }
            this.target = target;
            if (this.target) {
                this.target.addEventListener("error", this._errorListener);
                const $this = this;
                try {
                    this.target.console = this._console = new Proxy(this.target.console, {
                        get($target, p) {
                            if (p in $target === false) {
                                return;
                            }
                            if ($this.target === target && $this.$functions.indexOf(p) >= 0 && p in $this) {
                                return () => {
                                    $this[p].apply($this, arguments);
                                    return $target[p].apply($target, arguments);
                                };
                            }
                            return $target[p];
                        }
                    });
                }
                catch (e) {
                    this.error(e);
                }
            }
        }
    }
    exports.ConsoleModule = ConsoleModule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZW1vZHVsZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9kZXZ0b29scy9jb25zb2xlbW9kdWxlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUVBLHVFQUE2RDtJQUs3RCxNQUFhLGFBQWMsU0FBUSwwQ0FBZ0I7UUF1QmpELFlBQVksU0FBd0IsSUFBSTtZQUN0QyxLQUFLLENBQUM7Z0JBQ0osSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsSUFBSSxFQUFFLFNBQVM7YUFDaEIsQ0FBQyxDQUFDO1lBMUJLLGVBQVUsR0FBNkM7Z0JBQy9ELFFBQVE7Z0JBQ1IsT0FBTztnQkFDUCxPQUFPO2dCQUNQLE9BQU87Z0JBQ1AsS0FBSztnQkFDTCxRQUFRO2dCQUNSLE9BQU87Z0JBQ1AsT0FBTztnQkFDUCxnQkFBZ0I7Z0JBQ2hCLFVBQVU7Z0JBQ1YsTUFBTTtnQkFDTixLQUFLO2dCQUNMLE1BQU07Z0JBQ04sU0FBUztnQkFDVCxNQUFNO2FBQ1AsQ0FBQztZQUNNLGFBQVEsR0FBbUIsSUFBSSxDQUFDO1lBQ3hCLFdBQU0sR0FHVixJQUFJLENBQUM7WUE2RFAsY0FBUyxHQUF3QixRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3BFLGFBQVEsR0FBYSxFQUFFLENBQUM7WUFDMUIsa0JBQWEsR0FBVyxDQUFDLENBQUM7WUFDMUIsbUJBQWMsR0FBVyxDQUFDLENBQUM7WUFpQnpCLFdBQU0sR0FBWSxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xELFlBQU8sR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDO1lBMEgvQixhQUFRLEdBQTRCLEVBQUUsQ0FBQztZQXdCdkMsWUFBTyxHQUFjLEVBQUUsQ0FBQztZQXVDeEIsV0FBTSxHQUE0QixFQUFFLENBQUM7WUFtQnhDLGdCQUFXLEdBQVksS0FBSyxDQUFDO1lBb0M1QixtQkFBYyxHQUFHLENBQUMsQ0FBQyxLQUFp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