/// <reference path="../default.module.d.ts" />

import { i18n } from "../i18n/i18n.module";
import { MPCCalendarEventElement } from "./eventelement.module";

export class MPCCalendarDaysElement extends HTMLElement {
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

    var styleLink = <HTMLLinkElement>document.createElementNS("http://www.w3.org/1999/xhtml", "link");
    styleLink.href = "css/days-calendar.css";
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

    var hours = document.createElementNS("mpc", "hours");
    this._mpc_body.appendChild(hours);

    // create weeks 0-6
    MPCCalendarDaysElement._repeat(hour => {
      var mpc_hour = document.createElementNS("mpc", "hour");
      mpc_hour.setAttribute("hour", hour.toString());
      if (hour < 10) {
        mpc_hour.setAttribute("label", i18n("0" + hour + ":00", "mpc"));
      } else {
        mpc_hour.setAttribute("label", i18n(hour + ":00", "mpc"));
      }
      hours.appendChild(mpc_hour);
    }, 24, 1);
  }
  protected _mpc_style: HTMLStyleElement;
  protected _mpc_header: Element;
  protected _mpc_body: Element;

  protected _mpc_day_map: { [s: string]: Element; };
  protected _mpc_date: Date;

  private _updating_calendar: boolean = false;
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

  private _updating_events: boolean = false;
  updateEvents(): void | number {
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
    });

    // // Die TimeStamps für alle Tagesbeginne
    // var date_begins: {
    //   [n: number]: number;
    // } = Object.create(null);
    // // Die TimeStamps für alle Tagesenden
    // var date_ends: {
    //   [n: number]: number;
    // } = Object.create(null);

    // filter für ganztägige events
    events.forEach((event, index) => {
      // gehe zurück, wenn nicht wenigstens eines zutrifft:
      // - Wenn ein Event einen ganzen Tag dauert
      // - Wenn ein Event mehrere Tage dauert und ein Tag davon ganz eingenommen wird
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
        event.dispatchEvent(new (<{ new(type: string, eventInitDict: EventInit) }>e.constructor)(e.type, e));
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

  get date(): number {
    return parseInt(this.getAttribute("day") || "");
  }
  set date(value: number) {
    this.setAttribute("day", value.toString());
  }

  get dayCount(): number {
    return parseInt(this.getAttribute("day-count") || "");
  }
  set dayCount(value: number) {
    this.setAttribute("day-count", value.toString());
  }

  static get observedAttributes() {
    return ["year", "month", "day", "day-count"];
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
        var maxDays = new Date(this.year, this.month, 0).getDate();
        if (this.date > maxDays) {
          this.date = maxDays;
        }
        break;
      case "day":
        var maxDays = new Date(this.year, this.month, 0).getDate();
        if (
          isNaN(parsed_newValue) ||
          parsed_newValue < 1 ||
          parsed_newValue > maxDays ||
          parsed_newValue.toString() != newValue
        ) {
          this.setAttribute("month", oldValue);
        }
        break;
      case "day-count":
        if (
          isNaN(parsed_newValue) ||
          parsed_newValue < 1 ||
          parsed_newValue > 7 ||
          parsed_newValue.toString() != newValue
        ) {
          this.setAttribute("day-count", oldValue);
        }
        break;
    }
    this.updateCalendar();
  }
}
export namespace MPCCalendarDaysElement {
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

customElements.define("mpc-calendar-days", MPCCalendarDaysElement);