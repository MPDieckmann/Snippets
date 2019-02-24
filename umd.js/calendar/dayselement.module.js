(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../i18n/i18n.module"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const i18n_module_1 = require("../i18n/i18n.module");
    class MPCCalendarDaysElement extends HTMLElement {
        constructor() {
            super();
            this._updating_calendar = false;
            this._updating_events = false;
            this.initializeComponents();
            var date = new Date();
            if (isNaN(this.year)) {
                this.year = date.getFullYear();
            }
            if (isNaN(this.month)) {
                this.month = date.getMonth() + 1;
            }
            if (isNaN(this.date)) {
                this.date = date.getDate();
            }
            if (isNaN(this.dayCount)) {
                this.dayCount = 3;
            }
            this.updateCalendar();
        }
        initializeComponents() {
            this._mpc_shadowRoot = this.attachShadow({
                mode: "closed",
                delegatesFocus: true
            });
            var styleLink = document.createElementNS("http://www.w3.org/1999/xhtml", "link");
            styleLink.href = "css/days-calendar.css";
            styleLink.type = "text/css";
            styleLink.rel = "stylesheet";
            this._mpc_shadowRoot.appendChild(styleLink);
            this._mpc_style = document.createElementNS("http://www.w3.org/1999/xhtml", "style");
            this._mpc_style.type = "text/css";
            this._mpc_shadowRoot.appendChild(this._mpc_style);
            this._mpc_header = document.createElementNS("mpc", "header");
            this._mpc_shadowRoot.appendChild(this._mpc_header);
            this._mpc_body = document.createElementNS("mpc", "body");
            this._mpc_shadowRoot.appendChild(this._mpc_body);
            var hours = document.createElementNS("mpc", "hours");
            this._mpc_body.appendChild(hours);
            MPCCalendarDaysElement._repeat(hour => {
                var mpc_hour = document.createElementNS("mpc", "hour");
                mpc_hour.setAttribute("hour", hour.toString());
                if (hour < 10) {
                    mpc_hour.setAttribute("label", i18n_module_1.i18n("0" + hour + ":00", "mpc"));
                }
                else {
                    mpc_hour.setAttribute("label", i18n_module_1.i18n(hour + ":00", "mpc"));
                }
                hours.appendChild(mpc_hour);
            }, 24, 1);
        }
        updateCalendar() {
            if (this._updating_calendar) {
                setTimeout(this.updateCalendar.bind(this));
                return;
            }
            this._updating_calendar = true;
            Array.from(this._mpc_header.getElementsByTagNameNS("mpc", "day")).forEach(day => {
                day.remove();
            });
            Array.from(this._mpc_body.getElementsByTagNameNS("mpc", "day")).forEach(day => {
                day.remove();
            });
            this._mpc_day_map = Object.create(null);
            this._mpc_date = new Date(this.year, this.month - 1, this.date);
            var today = new Date();
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var tmp_date = new Date(this._mpc_date);
            var days = [i18n_module_1.i18n("Su.", "mpc"), i18n_module_1.i18n("Mo.", "mpc"), i18n_module_1.i18n("Tu.", "mpc"), i18n_module_1.i18n("We.", "mpc"), i18n_module_1.i18n("Th.", "mpc"), i18n_module_1.i18n("Fr.", "mpc"), i18n_module_1.i18n("Sa.", "mpc")];
            MPCCalendarDaysElement._repeat(index => {
                var day = document.createElementNS("mpc", "day");
                day.setAttribute("day", "0" + index.toString());
                day.setAttribute("date", tmp_date.getDate().toString());
                day.setAttribute("label", days[tmp_date.getDay()]);
                if (tmp_date.getTime() == today.getTime()) {
                    day.setAttribute("current", "");
                }
                this._mpc_header.appendChild(day);
                day = document.createElementNS("mpc", "day");
                day.setAttribute("day", "1" + index.toString());
                day.setAttribute("date", tmp_date.getDate().toString());
                this._mpc_body.appendChild(day);
                this._mpc_day_map[tmp_date.getMonth() + "-" + tmp_date.getDate()] = day;
                tmp_date.setDate(tmp_date.getDate() + 1);
            }, this.dayCount + 1, 1);
            this.updateEvents();
            this._updating_calendar = false;
        }
        updateEvents() {
            if (this._updating_events) {
                return setTimeout(this.updateEvents.bind(this));
            }
            console.log("updating events");
            this._updating_events = true;
            Array.from(this._mpc_body.getElementsByTagNameNS("mpc", "event")).forEach(event => {
                event.remove();
            });
            var first_date = new Date(this._mpc_date);
            var first_date_timestamp = first_date.getTime();
            var last_date = new Date(first_date);
            last_date.setDate(first_date.getDate() + this.dayCount);
            last_date.setTime(last_date.getTime() - 1);
            var last_date_timestamp = last_date.getTime();
            var event_style_string = "@namespace \"mpc\";";
            var events = MPCCalendarDaysElement._filter(this.events, event => {
                var event_begin_timestamp = Date.parse(event.begin);
                var event_end_timestamp = Date.parse(event.end);
                if (isNaN(event_begin_timestamp) ||
                    isNaN(event_end_timestamp) ||
                    event_end_timestamp < first_date_timestamp ||
                    event_begin_timestamp > last_date_timestamp) {
                    return false;
                }
                return true;
            }).sort((event1, event2) => {
                var event1_begin = Date.parse(event1.begin);
                var event2_begin = Date.parse(event2.begin);
                if (event1_begin > event2_begin) {
                    return 1;
                }
                if (event1_begin < event2_begin) {
                    return -1;
                }
                return 0;
            });
            events.forEach((event, index) => {
                var event_begin_timestamp = Date.parse(event.begin);
                if (event_begin_timestamp < first_date_timestamp) {
                    event_begin_timestamp = first_date_timestamp;
                }
                var event_begin = new Date(event_begin_timestamp);
                var date_begin = this._mpc_day_map[event_begin.getMonth() + "-" + event_begin.getDate()].getAttribute("day")[1];
                var event_end_timestamp = Date.parse(event.end);
                if (event_end_timestamp > last_date_timestamp) {
                    event_end_timestamp = last_date_timestamp;
                }
                var event_end = new Date(event_end_timestamp);
                var date_end = this._mpc_day_map[event_end.getMonth() + "-" + event_end.getDate()].getAttribute("day")[1];
                event_style_string += "\nevent[event-id=\"event-" + index + "\"]{";
                if (!event.outline) {
                    event_style_string += "background-";
                }
                event_style_string += "color:" + event.color + ";}";
                var mpc_event = document.createElementNS("mpc", "event");
                mpc_event.addEventListener("click", e => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    event.dispatchEvent(new e.constructor(e.type, e));
                });
                mpc_event.setAttribute("event-id", "event-" + index);
                mpc_event.setAttribute("text", event.text);
                if (event.outline) {
                    mpc_event.setAttribute("outline", "true");
                }
                mpc_event.setAttribute("start", date_begin);
                mpc_event.setAttribute("end", date_end);
                this._mpc_header.appendChild(mpc_event);
            });
            this._mpc_style.textContent = event_style_string;
            this._updating_events = false;
            console.log("events updated");
        }
        get events() {
            return this.getElementsByTagName("calendar-event");
        }
        get year() {
            return parseInt(this.getAttribute("year") || "");
        }
        set year(value) {
            this.setAttribute("year", value.toString());
        }
        get month() {
            return parseInt(this.getAttribute("month") || "");
        }
        set month(value) {
            this.setAttribute("month", value.toString());
        }
        get date() {
            return parseInt(this.getAttribute("day") || "");
        }
        set date(value) {
            this.setAttribute("day", value.toString());
        }
        get dayCount() {
            return parseInt(this.getAttribute("day-count") || "");
        }
        set dayCount(value) {
            this.setAttribute("day-count", value.toString());
        }
        static get observedAttributes() {
            return ["year", "month", "day", "day-count"];
        }
        attributeChangedCallback(name, oldValue, newValue) {
            var parsed_newValue = parseInt(newValue);
            switch (name) {
                case "year":
                    if (isNaN(parsed_newValue) ||
                        parsed_newValue.toString() != newValue) {
                        this.setAttribute("year", oldValue);
                    }
                    break;
                case "month":
                    if (isNaN(parsed_newValue) ||
                        parsed_newValue < 1 ||
                        parsed_newValue > 12 ||
                        parsed_newValue.toString() != newValue) {
                        this.setAttribute("month", oldValue);
                    }
                    var maxDays = new Date(this.year, this.month, 0).getDate();
                    if (this.date > maxDays) {
                        this.date = maxDays;
                    }
                    break;
                case "day":
                    var maxDays = new Date(this.year, this.month, 0).getDate();
                    if (isNaN(parsed_newValue) ||
                        parsed_newValue < 1 ||
                        parsed_newValue > maxDays ||
                        parsed_newValue.toString() != newValue) {
                        this.setAttribute("month", oldValue);
                    }
                    break;
                case "day-count":
                    if (isNaN(parsed_newValue) ||
                        parsed_newValue < 1 ||
                        parsed_newValue > 7 ||
                        parsed_newValue.toString() != newValue) {
                        this.setAttribute("day-count", oldValue);
                    }
                    break;
            }
            this.updateCalendar();
        }
    }
    exports.MPCCalendarDaysElement = MPCCalendarDaysElement;
    (function (MPCCalendarDaysElement) {
        MPCCalendarDaysElement._filter = Function.call.bind(Array.prototype.filter);
        function _repeat(callback, repeatCount, index = 0) {
            for (index; index < repeatCount; index++) {
                try {
                    callback(index);
                }
                catch (e) { }
            }
        }
        MPCCalendarDaysElement._repeat = _repeat;
    })(MPCCalendarDaysElement = exports.MPCCalendarDaysElement || (exports.MPCCalendarDaysElement = {}));
    customElements.define("mpc-calendar-days", MPCCalendarDaysElement);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5c2VsZW1lbnQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvY2FsZW5kYXIvZGF5c2VsZW1lbnQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBRUEscURBQTJDO0lBRzNDLE1BQWEsc0JBQXVCLFNBQVEsV0FBVztRQUVyRDtZQUNFLEtBQUssRUFBRSxDQUFDO1lBaUVGLHVCQUFrQixHQUFZLEtBQUssQ0FBQztZQWdEcEMscUJBQWdCLEdBQVksS0FBSyxDQUFDO1lBL0d4QyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUU1QixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1lBQ3RCLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDaEM7WUFDRCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQzthQUNsQztZQUNELElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDNUI7WUFDRCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO2FBQ25CO1lBRUQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3hCLENBQUM7UUFFRCxvQkFBb0I7WUFDbEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO2dCQUN2QyxJQUFJLEVBQUUsUUFBUTtnQkFDZCxjQUFjLEVBQUUsSUFBSTthQUNy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