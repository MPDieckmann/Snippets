import { i18n } from "../i18n/i18n.module";
export class MPCCalendarMonthElement extends HTMLElement {
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
        this._mpc_days["0-1"].setAttribute("label", i18n("Mo.", "mpc"));
        this._mpc_days["0-2"].setAttribute("label", i18n("Tu.", "mpc"));
        this._mpc_days["0-3"].setAttribute("label", i18n("We.", "mpc"));
        this._mpc_days["0-4"].setAttribute("label", i18n("Th.", "mpc"));
        this._mpc_days["0-5"].setAttribute("label", i18n("Fr.", "mpc"));
        this._mpc_days["0-6"].setAttribute("label", i18n("Sa.", "mpc"));
        this._mpc_days["0-7"].setAttribute("label", i18n("Su.", "mpc"));
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
})(MPCCalendarMonthElement || (MPCCalendarMonthElement = {}));
customElements.define("mpc-calendar-month", MPCCalendarMonthElement);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGhlbGVtZW50Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL2NhbGVuZGFyL21vbnRoZWxlbWVudC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRzNDLE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxXQUFXO0lBRXREO1FBQ0UsS0FBSyxFQUFFLENBQUM7UUFrRUEsZUFBVSxHQUE4QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVELGNBQVMsR0FBOEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUk3RCx1QkFBa0IsR0FBWSxLQUFLLENBQUM7UUFpRXBDLHFCQUFnQixHQUFZLEtBQUssQ0FBQztRQXRJeEMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFFNUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUN0QixJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDaEM7UUFDRCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxvQkFBb0I7UUFDbEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1lBQ3ZDLElBQUksRUFBRSxRQUFRO1lBQ2QsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxTQUFTLEdBQW9CLFFBQVEsQ0FBQyxlQUFlLENBQUMsOEJBQThCLEVBQUUs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