(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./monthelement.module", "./dayselement.module"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const monthelement_module_1 = require("./monthelement.module");
    const dayselement_module_1 = require("./dayselement.module");
    class MPCCalendarEventElement extends HTMLElement {
        constructor() {
            super();
        }
        get text() {
            return this.getAttribute("text") || "";
        }
        set text(value) {
            this.setAttribute("text", value);
        }
        get outline() {
            return this.getAttribute("outline") == "true";
        }
        set outline(value) {
            if (value) {
                this.setAttribute("outline", "true");
            }
            else {
                this.removeAttribute("outline");
            }
        }
        get color() {
            return this.getAttribute("color") || "";
        }
        set color(value) {
            this.setAttribute("color", value);
        }
        get begin() {
            return this.getAttribute("begin") || "";
        }
        set begin(value) {
            this.setAttribute("begin", value);
        }
        get end() {
            return this.getAttribute("end") || "";
        }
        set end(value) {
            this.setAttribute("end", value);
        }
        connectedCallback() {
            console.log('MPCCalendarEvent element connected to page.');
            if (this.parentElement instanceof monthelement_module_1.MPCCalendarMonthElement || this.parentElement instanceof dayselement_module_1.MPCCalendarDaysElement) {
                this.parentElement.updateCalendar();
            }
        }
        disconnectedCallback() {
            console.log('MPCCalendarEvent element disconnected from page.');
            if (this.parentElement instanceof monthelement_module_1.MPCCalendarMonthElement || this.parentElement instanceof dayselement_module_1.MPCCalendarDaysElement) {
                this.parentElement.updateCalendar();
            }
        }
        adoptedCallback() {
            console.log('MPCCalendarEvent element adopted to new page.');
            if (this.parentElement instanceof monthelement_module_1.MPCCalendarMonthElement || this.parentElement instanceof dayselement_module_1.MPCCalendarDaysElement) {
                this.parentElement.updateCalendar();
            }
        }
        static get observedAttributes() {
            return ['text', 'outline', 'color', "begin", "end"];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            var parsed_newValue = parseInt(newValue);
            switch (name) {
                case "text":
                    break;
                case "outline":
                    break;
                case "color":
                    break;
                case "begin":
                    break;
                case "end":
                    break;
            }
        }
    }
    exports.MPCCalendarEventElement = MPCCalendarEventElement;
    customElements.define("mpc-calendar-event", MPCCalendarEventElement);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRlbGVtZW50Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL2NhbGVuZGFyL2V2ZW50ZWxlbWVudC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFFQSwrREFBZ0U7SUFDaEUsNkRBQThEO0lBRTlELE1BQWEsdUJBQXdCLFNBQVEsV0FBVztRQUN0RDtZQUNFLEtBQUssRUFBRSxDQUFDO1FBRVYsQ0FBQztRQUVELElBQUksSUFBSTtZQUNOLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDekMsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLEtBQWE7WUFDcEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkMsQ0FBQztRQUVELElBQUksT0FBTztZQUNULE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxNQUFNLENBQUM7UUFDaEQsQ0FBQztRQUNELElBQUksT0FBTyxDQUFDLEtBQWM7WUFDeEIsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDdEM7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUNqQztRQUNILENBQUM7UUFFRCxJQUFJLEtBQUs7WUFDUCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFDLENBQUM7UUFDRCxJQUFJLEtBQUssQ0FBQyxLQUFhO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxJQUFJLEtBQUs7WUFDUCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFDLENBQUM7UUFDRCxJQUFJLEtBQUssQ0FBQyxLQUFhO1lBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRCxJQUFJLEdBQUc7WUFDTCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3hDLENBQUM7UUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFhO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRCxpQkFBaUI7WUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7WUFDM0QsSUFBSSxJQUFJLENBQUMsYUFBYSxZQUFZLDZDQUF1QixJQUFJLElBQUksQ0FBQyxhQUFhLFlBQVksMkNBQXNCLEVBQUU7Z0JBQ2pILElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLENBQUM7YUFDckM7UUFDSCxDQUFDO1FBRUQsb0JBQW9CO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0RBQWtELENBQUMsQ0FBQztZQUNoRSxJQUFJLElBQUksQ0FBQyxhQUFhLFlBQVksNkNBQXVCLElBQUksSUFBSSxDQUFDLGFBQWEsWUFBWSwyQ0FBc0IsRUFBRTtnQkFDakgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUNyQztRQUNILENBQUM7UUFFRCxlQUFlO1lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1lBQzdELElBQUksSUFBSSxDQUFDLGFBQWEsWUFBWSw2Q0FBdUIsSUFBSSxJQUFJLENBQUMsYUFBYSxZQUFZLDJDQUFzQixFQUFFO2dCQUNqSCxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3JDO1FBQ0gsQ0FBQztRQUVELE1BQU0sS0FBSyxrQkFBa0I7WUFDM0IsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBRUQsd0JBQXdCLENBQUMsSUFBWSxFQUFFLFFBQWdCLEVBQUUsUUFBZ0I7WUFDdkUsSUFBSSxlQUFlLEdBQVcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pELFFBQVEsSUFBSSxFQUFFO2dCQUNaLEtBQUssTUFBTTtvQkFDVCxNQUFNO2dCQUNSLEtBQUssU0FBUztvQkFDWixNQUFNO2dCQUNSLEtBQUssT0FBTztvQkFDVixNQUFNO2dCQUNSLEtBQUssT0FBTztvQkFDVixNQUFNO2dCQUNSLEtBQUssS0FBSztvQkFDUixNQUFNO2FBQ1Q7UUFDSCxDQUFDO0tBQ0Y7SUFyRkQsMERBcUZDO0lBRUQsY0FBYyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDIn0=