"use strict";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9udGhlbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvY2FsZW5kYXIvbW9udGhlbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFJQSxNQUFNLHVCQUF3QixTQUFRLFdBQVc7SUFFL0M7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQWtFQSxlQUFVLEdBQThCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUQsY0FBUyxHQUE4QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBSTdELHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQWlFcEMscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBdEl4QyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUU1QixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3RCLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNoQztRQUNELElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDbEM7UUFFRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELG9CQUFvQjtRQUNsQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDdkMsSUFBSSxFQUFFLFFBQVE7WUFDZCxjQUFjLEVBQUUsSUFBSTtTQUNyQixDQUFDLENBQUM7UUFFSCxJQUFJLFNBQVMsR0FBb0IsUUFBUSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNsRyxTQUFTLENBQUMsSUFBSSxHQUFHLHdCQUF3QixDQUFDO1FBQzFDLFNB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