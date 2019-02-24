/// <reference path="../default.d.ts" />
/// <reference path="./monthelement.ts" />
/// <reference path="./dayselement.ts" />

class MPCCalendarEventElement extends HTMLElement {
  constructor() {
    super();

  }

  get text(): string {
    return this.getAttribute("text") || "";
  }
  set text(value: string) {
    this.setAttribute("text", value);
  }

  get outline() {
    return this.getAttribute("outline") == "true";
  }
  set outline(value: boolean) {
    if (value) {
      this.setAttribute("outline", "true");
    } else {
      this.removeAttribute("outline");
    }
  }

  get color() {
    return this.getAttribute("color") || "";
  }
  set color(value: string) {
    this.setAttribute("color", value);
  }

  get begin() {
    return this.getAttribute("begin") || "";
  }
  set begin(value: string) {
    this.setAttribute("begin", value);
  }

  get end() {
    return this.getAttribute("end") || "";
  }
  set end(value: string) {
    this.setAttribute("end", value);
  }

  connectedCallback() {
    console.log('MPCCalendarEvent element connected to page.');
    if (this.parentElement instanceof MPCCalendarMonthElement || this.parentElement instanceof MPCCalendarDaysElement) {
      this.parentElement.updateCalendar();
    }
  }

  disconnectedCallback() {
    console.log('MPCCalendarEvent element disconnected from page.');
    if (this.parentElement instanceof MPCCalendarMonthElement || this.parentElement instanceof MPCCalendarDaysElement) {
      this.parentElement.updateCalendar();
    }
  }

  adoptedCallback() {
    console.log('MPCCalendarEvent element adopted to new page.');
    if (this.parentElement instanceof MPCCalendarMonthElement || this.parentElement instanceof MPCCalendarDaysElement) {
      this.parentElement.updateCalendar();
    }
  }

  static get observedAttributes() {
    return ['text', 'outline', 'color', "begin", "end"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    var parsed_newValue: number = parseInt(newValue);
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

customElements.define("mpc-calendar-event", MPCCalendarEventElement);