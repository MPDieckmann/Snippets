import { ExtendableModule } from './extendablemodule.module';
export class ConsoleModule extends ExtendableModule {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZW1vZHVsZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9kZXZ0b29scy9jb25zb2xlbW9kdWxlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUs3RCxNQUFNLE9BQU8sYUFBYyxTQUFRLGdCQUFnQjtJQXVCakQsWUFBWSxTQUF3QixJQUFJO1FBQ3RDLEtBQUssQ0FBQztZQUNKLElBQUksRUFBRSxTQUFTO1lBQ2YsSUFBSSxFQUFFLFNBQVM7U0FDaEIsQ0FBQyxDQUFDO1FBMUJLLGVBQVUsR0FBNkM7WUFDL0QsUUFBUTtZQUNSLE9BQU87WUFDUCxPQUFPO1lBQ1AsT0FBTztZQUNQLEtBQUs7WUFDTCxRQUFRO1lBQ1IsT0FBTztZQUNQLE9BQU87WUFDUCxnQkFBZ0I7WUFDaEIsVUFBVTtZQUNWLE1BQU07WUFDTixLQUFLO1lBQ0wsTUFBTTtZQUNOLFNBQVM7WUFDVCxNQUFNO1NBQ1AsQ0FBQztRQUNNLGFBQVEsR0FBbUIsSUFBSSxDQUFDO1FBQ3hCLFdBQU0sR0FHVixJQUFJLENBQUM7UUE2RFAsY0FBUyxHQUF3QixRQUFRLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BFLGFBQVEsR0FBYSxFQUFFLENBQUM7UUFDMUIsa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsbUJBQWMsR0FBVyxDQUFDLENBQUM7UUFpQnpCLFdBQU0sR0FBWSxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELFlBQU8sR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDO1FBMEgvQixhQUFRLEdBQTRCLEVBQUUsQ0FBQztRQXdCdkMsWUFBTyxHQUFjLEVBQUUsQ0FBQztRQXVDeEIsV0FBTSxHQUE0QixFQUFFLENBQUM7UUFtQnhDLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBb0M1QixtQkFBYyxHQUFHLENBQUMs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