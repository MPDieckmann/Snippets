import { i18n } from "../i18n/i18n.module";
export class MPCCalendarDaysElement extends HTMLElement {
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
                mpc_hour.setAttribute("label", i18n("0" + hour + ":00", "mpc"));
            }
            else {
                mpc_hour.setAttribute("label", i18n(hour + ":00", "mpc"));
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
        var days = [i18n("Su.", "mpc"), i18n("Mo.", "mpc"), i18n("Tu.", "mpc"), i18n("We.", "mpc"), i18n("Th.", "mpc"), i18n("Fr.", "mpc"), i18n("Sa.", "mpc")];
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
})(MPCCalendarDaysElement || (MPCCalendarDaysElement = {}));
customElements.define("mpc-calendar-days", MPCCalendarDaysElement);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF5c2VsZW1lbnQubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvY2FsZW5kYXIvZGF5c2VsZW1lbnQubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUczQyxNQUFNLE9BQU8sc0JBQXVCLFNBQVEsV0FBVztJQUVyRDtRQUNFLEtBQUssRUFBRSxDQUFDO1FBaUVGLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQWdEcEMscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBL0d4QyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUU1QixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3RCLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNoQztRQUNELElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDbEM7UUFDRCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDcEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDNUI7UUFDRCxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7U0FDbkI7UUFFRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELG9CQUFvQjtRQUNsQixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDdkMsSUFBSSxFQUFFLFFBQVE7WUFDZCxj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