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
    class MPCCalendarMonthElement extends HTMLElement {
        constructor() {
            super();
            this._mpc_weeks = Object.create(null);
            this._mpc_days = Object.create(null);
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
            this.updateCalendar();
        }
        initializeComponents() {
            this._mpc_shadowRoot = this.attachShadow({
                mode: "closed",
                delegatesFocus: true
            });
            var styleLink = document.createElementNS("http://www.w3.org/1999/xhtml", "link");
            styleLink.href = "css/month-calendar.css";
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
            MPCCalendarMonthElement._repeat(weekCount => {
                var week = document.createElementNS("mpc", "week");
                week.setAttribute("week", weekCount.toString());
                this._mpc_weeks[weekCount] = week;
                MPCCalendarMonthElement._repeat(dayCount => {
                    var day = document.createElementNS("mpc", "day");
                    day.setAttribute("day-of-week", dayCount.toString());
                    day.setAttribute("day", weekCount + "-" + dayCount);
                    day.setAttribute("label", "");
                    this._mpc_days[weekCount + "-" + dayCount] = day;
                    week.appendChild(day);
                }, 8, 1);
            }, 7);
            this._mpc_header.appendChild(this._mpc_weeks[0]);
            MPCCalendarMonthElement._repeat(index => {
                this._mpc_body.appendChild(this._mpc_weeks[index]);
            }, 7, 1);
        }
        updateCalendar() {
            if (this._updating_calendar) {
                return setTimeout(this.updateCalendar.bind(this));
            }
            this._updating_calendar = true;
            this._mpc_date = new Date(this.year, this.month - 1);
            var tmp_dayOfWeek = this._mpc_date.getDay();
            if (tmp_dayOfWeek == 0) {
                tmp_dayOfWeek = 7;
            }
            this._mpc_day_map = Object.create(null);
            var today = new Date();
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var tmp_date = new Date(this._mpc_date);
            tmp_date.setDate(this._mpc_date.getDate() - tmp_dayOfWeek + 1);
            this._mpc_days["0-1"].setAttribute("label", i18n_module_1.i18n("Mo.", "mpc"));
            this._mpc_days["0-2"].setAttribute("label", i18n_module_1.i18n("Tu.", "mpc"));
            this._mpc_days["0-3"].setAttribute("label", i18n_module_1.i18n("We.", "mpc"));
            this._mpc_days["0-4"].setAttribute("label", i18n_module_1.i18n("Th.", "mpc"));
            this._mpc_days["0-5"].setAttribute("label", i18n_module_1.i18n("Fr.", "mpc"));
            this._mpc_days["0-6"].setAttribute("label", i18n_module_1.i18n("Sa.", "mpc"));
            this._mpc_days["0-7"].setAttribute("label", i18n_module_1.i18n("Su.", "mpc"));
            MPCCalendarMonthElement._repeat(index => {
                this._mpc_days["0-" + index].removeAttribute("current");
            }, 8, 1);
            MPCCalendarMonthElement._repeat(week => {
                MPCCalendarMonthElement._repeat(dayOfWeek => {
                    var day = this._mpc_days[week + "-" + dayOfWeek];
                    day.setAttribute("label", tmp_date.getDate().toString());
                    this._mpc_day_map[tmp_date.getMonth() + "-" + tmp_date.getDate()] = day;
                    if (week == 1) {
                        day.setAttribute("month", tmp_date.getMonth() != this.month - 1 ? "prev" : "curr");
                    }
                    else {
                        day.setAttribute("month", tmp_date.getMonth() != this.month - 1 ? "next" : "curr");
                    }
                    if (tmp_date.getTime() == today.getTime()) {
                        day.setAttribute("current", "");
                        if (tmp_date.getDay() == 0) {
                            this._mpc_days["0-" + 7].setAttribute("current", "");
                        }
                        else {
                            this._mpc_days["0-" + tmp_date.getDay()].setAttribute("current", "");
                        }
                    }
                    else {
                        day.removeAttribute("current");
                    }
                    tmp_date.setDate(tmp_date.getDate() + 1);
                }, 8, 1);
            }, 7, 1);
            this.updateEvents();
            this._updating_calendar = false;
        }
        updateEvents() {
            if (this._updating_events === true) {
                return setTimeout(this.updateEvents.bind(this));
            }
            this._updating_events = true;
            Array.from(this._mpc_body.getElementsByTagNameNS("mpc", "event")).forEach(event => {
                event.remove();
            });
            var first_date = new Date(this._mpc_date);
            var first_dayOfWeek = this._mpc_date.getDay();
            if (first_dayOfWeek == 0) {
                first_dayOfWeek = 7;
            }
            first_date.setDate(this._mpc_date.getDate() - first_dayOfWeek + 1);
            var first_date_timestamp = first_date.getTime();
            var last_date = new Date(first_date);
            last_date.setDate(first_date.getDate() + 6 * 7);
            last_date.setTime(last_date.getTime() - 1);
            var last_date_timestamp = last_date.getTime();
            var event_style_string = "@namespace \"mpc\";";
            MPCCalendarMonthElement._filter(this.events, event => {
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
            }).forEach((event, index) => {
                var event_begin_timestamp = Date.parse(event.begin);
                if (event_begin_timestamp < first_date_timestamp) {
                    event_begin_timestamp = first_date_timestamp;
                }
                var event_begin = new Date(event_begin_timestamp);
                var date_begin = parseInt(this._mpc_day_map[event_begin.getMonth() + "-" + event_begin.getDate()].getAttribute("day")[0]);
                var event_end_timestamp = Date.parse(event.end);
                if (event_end_timestamp > last_date_timestamp) {
                    event_end_timestamp = last_date_timestamp;
                }
                var event_end = new Date(event_end_timestamp);
                var date_end = parseInt(this._mpc_day_map[event_end.getMonth() + "-" + event_end.getDate()].getAttribute("day")[0]);
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
                var start_day = event_begin.getDay();
                if (start_day == 0) {
                    start_day = 7;
                }
                mpc_event.setAttribute("start", start_day.toString());
                while (date_begin < date_end) {
                    mpc_event.setAttribute("end", "7");
                    this._mpc_weeks[date_begin++].appendChild(mpc_event);
                    mpc_event = document.createElementNS("mpc", "event");
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
                    mpc_event.setAttribute("start", "1");
                }
                var end_day = event_end.getDay();
                if (end_day == 0) {
                    end_day = 7;
                }
                mpc_event.setAttribute("end", end_day.toString());
                this._mpc_weeks[date_begin++].appendChild(mpc_event);
            });
            this._mpc_style.textContent = event_style_string;
            this._updating_events = false;
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
        static get observedAttributes() {
            return ["year", "month"];
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
                    break;
            }
            this.updateCalendar();
        }
    }
    exports.MPCCalendarMonthElement = MPCCalendarMonthElement;
    (function (MPCCalendarMonthElement) {
        MPCCalendarMonthElement._filter = Function.call.bind(Array.prototype.filter);
        function _repeat(callback, repeatCount, index = 0) {
            for (index; index < repeatCount; index++) {
                try {
                    callback(index);
                }
                catch (e) { }
            }
        }
        MPCCalendarMonthElement._repeat = _repeat;
    })(MPCCalendarMonthElement = exports.MPCCalendarMonthElement || (exports.MPCCalendarMonthElement = {}));
    customElements.define("mpc-calendar-month", MPCCalendarMonthElement);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGhlbGVtZW50Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL2NhbGVuZGFyL21vbnRoZWxlbWVudC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFFQSxxREFBMkM7SUFHM0MsTUFBYSx1QkFBd0IsU0FBUSxXQUFXO1FBRXREO1lBQ0UsS0FBSyxFQUFFLENBQUM7WUFrRUEsZUFBVSxHQUE4QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVELGNBQVMsR0FBOEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUk3RCx1QkFBa0IsR0FBWSxLQUFLLENBQUM7WUFpRXBDLHFCQUFnQixHQUFZLEtBQUssQ0FBQztZQXRJeEMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFFNUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN0QixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ2hDO1lBQ0QsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDbEM7WUFFRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEIsQ0FBQztRQUVELG9CQUFvQjtZQUNsQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3ZDLElBQUksRUFBRSxRQUFRO2dCQUNkLGNBQWMsRUFBRSxJQUFJO2FBQ3JCLENBQUMsQ0FBQztZQUVILElBQUksU0FBUyxHQUFvQixRQUFRLENBQUMsZUFBZSxDQUFDLDhCQUE4QixFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2xH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