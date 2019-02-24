(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ExtendableModule {
        constructor(options) {
            this.element = document.createElement("module");
            this.header = document.createElement("button");
            this.element.setAttribute("type", options.type);
        }
        onfocus() { }
        onblur() { }
    }
    exports.ExtendableModule = ExtendableModule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5kYWJsZW1vZHVsZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9kZXZ0b29scy9leHRlbmRhYmxlbW9kdWxlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUVBLE1BQWEsZ0JBQWdCO1FBRzNCLFlBQXNCLE9BQWlDO1lBRmhELFlBQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLFdBQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRS9DLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNNLE9BQU8sS0FBSyxDQUFDO1FBQ2IsTUFBTSxLQUFLLENBQUM7S0FDcEI7SUFSRCw0Q0FRQyJ9