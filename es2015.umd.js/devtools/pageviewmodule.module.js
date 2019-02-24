(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./extendablemodule.module", "./consolemodule.module"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const extendablemodule_module_1 = require("./extendablemodule.module");
    const consolemodule_module_1 = require("./consolemodule.module");
    class PageViewModule extends extendablemodule_module_1.ExtendableModule {
        constructor(url = "about:blank") {
            super({
                name: "PageView",
                type: "pageview"
            });
            this.iframe = document.createElement("iframe");
            this.iframe.src = url;
            this.console = new consolemodule_module_1.ConsoleModule();
            this.iframe.addEventListener("load", () => {
                if (this.iframe.contentWindow) {
                    this.console.bind(this.iframe.contentWindow);
                }
            });
            this.element.appendChild(this.iframe);
        }
    }
    exports.PageViewModule = PageViewModule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZXZpZXdtb2R1bGUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvZGV2dG9vbHMvcGFnZXZpZXdtb2R1bGUubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBRUEsdUVBQTZEO0lBQzdELGlFQUF1RDtJQUV2RCxNQUFhLGNBQWUsU0FBUSwwQ0FBZ0I7UUFHbEQsWUFBWSxNQUFjLGFBQWE7WUFDckMsS0FBSyxDQUFDO2dCQUNKLElBQUksRUFBRSxVQUFVO2dCQUNoQixJQUFJLEVBQUUsVUFBVTthQUNqQixDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxvQ0FBYSxFQUFFLENBQUM7WUFFbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO2dCQUN4QyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO29CQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUM5QztZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLENBQUM7S0FDRjtJQXJCRCx3Q0FxQkMifQ==