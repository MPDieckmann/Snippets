/// <reference path="../default.d.ts" />
/// <reference path="../i18n/i18n.ts" />
/// <reference path="./eventelement.ts" />

class MPCCalendarMonthElement extends HTMLElement {
  private _mpc_shadowRoot: ShadowRoot;
  constructor() {
    super();

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

    var styleLink = <HTMLLinkElement>document.createElementNS("http://www.w3.org/1999/xhtml", "link");
    styleLink.href = "css/month-calendar.css";
    styleLink.type = "text/css";
    styleLink.rel = "stylesheet";
    this._mpc_shadowRoot.appendChild(styleLink);

    this._mpc_style = <HTMLStyleElement>document.createElementNS("http://www.w3.org/1999/xhtml", "style");
    this._mpc_style.type = "text/css";
    this._mpc_shadowRoot.appendChild(this._mpc_style);

    this._mpc_header = document.createElementNS("mpc", "header");
    this._mpc_shadowRoot.appendChild(this._mpc_header);

    this._mpc_body = document.createElementNS("mpc", "body");
    this._mpc_shadowRoot.appendChild(this._mpc_body);


    // create weeks 0-6
    MPCCalendarMonthElement._repeat(weekCount => {
      var week = document.createElementNS("mpc", "week");
      week.setAttribute("week", weekCount.toString());
      this._mpc_weeks[weekCount] = week;

      // create days 1-7
      MPCCalendarMonthElement._repeat(dayCount => {
        var day = document.createElementNS("mpc", "day");
        day.setAttribute("day-of-week", dayCount.toString());
        day.setAttribute("day", weekCount + "-" + dayCount);
        day.setAttribute("label", "");
        this._mpc_days[weekCount + "-" + dayCount] = day;
        week.appendChild(day);
      }, 8, 1);
    }, 7);

    // append week 0 to header
    this._mpc_header.appendChild(this._mpc_weeks[0]);
    // append weeks 1-6 to body
    MPCCalendarMonthElement._repeat(index => {
      this._mpc_body.appendChild(this._mpc_weeks[index]);
    }, 7, 1);
  }
  protected _mpc_style: HTMLStyleElement;
  protected _mpc_header: Element;
  protected _mpc_body: Element;

  protected _mpc_weeks: { [s: string]: Element; } = Object.create(null);
  protected _mpc_days: { [s: string]: Element; } = Object.create(null);
  protected _mpc_day_map: { [s: string]: Element; };
  protected _mpc_date: Date;

  private _updating_calendar: boolean = false;
  updateCalendar(): void | number {
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
    // tmp_date ist nun der erste Tag der ersten anzuzeigenden Woche
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
        } else {
          day.setAttribute("month", tmp_date.getMonth() != this.month - 1 ? "next" : "curr");
        }

        if (tmp_date.getTime() == today.getTime()) {
          day.setAttribute("current", "");
          if (tmp_date.getDay() == 0) {
            this._mpc_days["0-" + 7].setAttribute("current", "");
          } else {
            this._mpc_days["0-" + tmp_date.getDay()].setAttribute("current", "");
          }
        } else {
          day.removeAttribute("current");
        }

        tmp_date.setDate(tmp_date.getDate() + 1);
      }, 8, 1);
    }, 7, 1);

    this.updateEvents();
    this._updating_calendar = false;
  }

  private _updating_events: boolean = false;
  updateEvents(): void | number {
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
      if (
        isNaN(event_begin_timestamp) ||
        isNaN(event_end_timestamp) ||
        event_end_timestamp < first_date_timestamp ||
        event_begin_timestamp > last_date_timestamp
      ) {
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
        event.dispatchEvent(new (<{ new(type: string, eventInitDict: EventInit) }>e.constructor)(e.type, e));
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
          event.dispatchEvent(new (<{ new(type: string, eventInitDict: EventInit) }>e.constructor)(e.type, e));
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

  get events(): HTMLCollectionOf<MPCCalendarEventElement> {
    return <HTMLCollectionOf<MPCCalendarEventElement>>this.getElementsByTagName("calendar-event");
  }

  get year(): number {
    return parseInt(this.getAttribute("year") || "");
  }
  set year(value: number) {
    this.setAttribute("year", value.toString());
  }

  get month(): number {
    return parseInt(this.getAttribute("month") || "");
  }
  set month(value: number) {
    this.setAttribute("month", value.toString());
  }

  static get observedAttributes() {
    return ["year", "month"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    var parsed_newValue: number = parseInt(newValue);
    switch (name) {
      case "year":
        if (
          isNaN(parsed_newValue) ||
          parsed_newValue.toString() != newValue
        ) {
          this.setAttribute("year", oldValue);
        }
        break;
      case "month":
        if (
          isNaN(parsed_newValue) ||
          parsed_newValue < 1 ||
          parsed_newValue > 12 ||
          parsed_newValue.toString() != newValue
        ) {
          this.setAttribute("month", oldValue);
        }
        break;
    }
    this.updateCalendar();
  }
}
namespace MPCCalendarMonthElement {
  /**
   * @private
   */
  export const _filter = <{
    <T>(elements: Iterable<T>, callback: (element: T) => boolean): T[];
  }>Function.call.bind(Array.prototype.filter);

  /**
   * @private
   * @param callback 
   * @param repeatCount 
   * @param index 
   */
  export function _repeat(callback: (index: number) => void, repeatCount: number, index: number = 0) {
    for (index; index < repeatCount; index++) {
      try {
        callback(index);
      }
      catch (e) { }
    }
  }
}

customElements.define("mpc-calendar-month", MPCCalendarMonthElement);