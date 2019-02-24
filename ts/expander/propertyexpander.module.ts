/// <reference path="../default.module.d.ts" />

import { MPCExpanderElement } from "./expander.module";

export class MPCPropertyExpanderElement<T> extends MPCExpanderElement {
  static toType(o: any): string {
    var type = typeof o;
    if (type == "object") {
      try {
        if (o == null) {
          return "null";
        } else if (o instanceof RegExp) {
          return "regexp";
        } else if (o instanceof Node) {
          return "node";
        } else if ("length" in o && typeof o.length == "number") {
          return "iterable";
        }
      } catch (e) { }
    }
    return type;
  }

  constructor() {
    super();

    this.addEventListener("expand", event => {
      if (!this.$wasExpanded) {
        this.$getProperties();
        this.$wasExpanded = true;
      }
    });
  }

  protected $toType() {
    return MPCPropertyExpanderElement.toType(this.$property);
  }

  protected $wasExpanded: boolean = false;

  private _type: string = "";
  public get type(): string {
    return this._type;
  }

  protected $property: T;
  public get property() {
    return this.$property;
  }
  public set property(value: T) {
    if ("$property" in this && this.$property === value) {
      return;
    }
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.$wasExpanded = false;
    this.expanded = false;
    this.$property = value;
    this._type = this.$toType();
    this.setAttribute("type", this._type);

    if (("$type_" + this._type) in this) {
      this["$type_" + this._type](value);
    }
  }

  protected $propertySorter(a: PropertyKey, b: PropertyKey) {
    if (a == b) {
      return 0;
    }
    if (typeof a == "symbol") {
      if (typeof b != "symbol") {
        return 1;
      }
      a = a.toString();
    }
    if (typeof b == "symbol") {
      if (typeof a != "symbol") {
        return -1;
      }
      b = b.toString();
    }
    var index = 0;
    var length = Math.min(a.length, b.length);
    for (index; index < length; index++) {
      if (a[index] == "_" && a[index] != b[index]) {
        return 1;
      }
      if (b[index] == "_" && a[index] != b[index]) {
        return -1;
      }
      if (a[index] == "$" && a[index] != b[index]) {
        return 1;
      }
      if (b[index] == "$" && a[index] != b[index]) {
        return -1;
      }
      if (a.charCodeAt(index) > b.charCodeAt(index)) {
        return 1;
      } else if (a.charCodeAt(index) < b.charCodeAt(index)) {
        return -1;
      }
    }
    if (a.length > b.length) {
      return 1;
    } else if (a.length < b.length) {
      return -1;
    }
    return 0;
  }
  protected $getProperties() {
    var properties: Map<PropertyKey, {
      prototype: any,
      property: PropertyKey,
      descriptor: PropertyDescriptor
    }> = new Map();
    var prototype: T = this.$property;
    do {
      Object.getOwnPropertyNames(prototype).forEach(property => {
        if (!properties.has(property)) {
          properties.set(property, {
            prototype,
            property,
            descriptor: Object.getOwnPropertyDescriptor(prototype, property)
          });
        }
      });
      Object.getOwnPropertySymbols(prototype).forEach(property => {
        if (!properties.has(property)) {
          properties.set(property, {
            prototype,
            property,
            descriptor: Object.getOwnPropertyDescriptor(prototype, property)
          });
        }
      });
    } while (prototype = Object.getPrototypeOf(prototype) || (<any>prototype).__proto__);
    Array.from(properties.keys()).sort(this.$propertySorter).forEach(property => {
      var prop = properties.get(property);
      if ("value" in prop.descriptor) {
        this.$createValue(prop);
      } else {
        if ("get" in prop.descriptor) {
          this.$createGet(prop);
        }
        if (prop.prototype === this.$property) {
          this.$createGetter(prop);
          this.$createSetter(prop);
        }
      }
    });
  }
  protected $createValue(prop: {
    prototype: any,
    property: PropertyKey,
    descriptor: PropertyDescriptor
  }) {
    var expander = <MPCPropertyExpanderElement<any>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
    expander.property = prop.descriptor.value;
    if (!prop.descriptor.enumerable) {
      expander.label.style.opacity = "0.9";
    }
    this.appendChild(expander);

    var key = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander-key");
    key.textContent = prop.property.toString() + ": ";
    expander.label.insertBefore(key, expander.label.firstChild);
  }
  protected $createGet(prop: {
    prototype: any,
    property: PropertyKey,
    descriptor: PropertyDescriptor
  }) {
    var placeholder = <MPCPropertyExpanderElement<any>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
    placeholder.labelText = "(...)";
    placeholder._type = "placeholder";
    placeholder.setAttribute("type", "placeholder");
    placeholder.expandable = true;

    if (!prop.descriptor.enumerable) {
      placeholder.label.style.opacity = "0.9";
    }
    this.appendChild(placeholder);

    var key = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander-key");
    key.textContent = prop.property.toString() + ": ";
    placeholder.label.insertBefore(key, placeholder.label.firstChild);

    var _this = this;

    placeholder.addEventListener("expand", function onexpand() {
      placeholder.removeEventListener("expand", onexpand);

      try {
        placeholder.property = prop.descriptor.get.call(_this.$property);
      } catch (e) {
        placeholder.property = e;
        placeholder.labelText = "[" + placeholder.labelText + "]";
        placeholder.label.style.color = "#f00";
      }
      if (!prop.descriptor.enumerable) {
        placeholder.label.style.opacity = "0.9";
      }

      placeholder.label.insertBefore(key, placeholder.label.firstChild);
    });
  }
  protected $createGetter(prop: {
    prototype: any,
    property: PropertyKey,
    descriptor: PropertyDescriptor
  }) {
    if (prop.prototype == this.$property) {
      var expander = <MPCPropertyExpanderElement<Function>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
      expander.property = prop.descriptor.get;
      expander.label.style.fontStyle = "italic";
      if (!prop.descriptor.enumerable) {
        expander.label.style.opacity = "0.9";
      }
      this.appendChild(expander);

      var key = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander-key");
      key.textContent = "get " + prop.property.toString() + ": ";
      expander.label.insertBefore(key, expander.label.firstChild);
    }
  }
  protected $createSetter(prop: {
    prototype: any,
    property: PropertyKey,
    descriptor: PropertyDescriptor
  }) {
    if (prop.prototype == this.$property) {
      var expander = <MPCPropertyExpanderElement<Function>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
      expander.property = prop.descriptor.set;
      expander.label.style.fontStyle = "italic";
      if (!prop.descriptor.enumerable) {
        expander.label.style.opacity = "0.9";
      }
      this.appendChild(expander);

      var key = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander-key");
      key.textContent = "set " + prop.property.toString() + ": ";
      expander.label.insertBefore(key, expander.label.firstChild);
    }
  }

  protected $type_boolean(property: boolean) {
    this.expandable = false;
    this.labelText = property.toString();
  }
  protected $type_function(property: Function) {
    this.expandable = true;
    var string = property.toString().replace(/\s+/g, " ").trim();
    if (/^class|function/.test(string)) {
      this.labelText = string.split("{", 1)[0] + "{ [code] }";
    } else if (/(?:^=>)*=> \{/.test(string)) {
      this.labelText = string.split("{", 1)[0] + "{ [code] }";
    } else if (/[^\)]*\) {/.test(string)) {
      this.labelText = string.split("{", 1)[0] + "{ [code] }";
    } else {
      this.labelText = string;
    }
  }
  protected $type_iterable(property: { [i: number]: any; length: number; }) {
    this.expandable = true;
    var constructorName = Object.prototype.toString.call(property).replace(/^\[object (.*)\]$/, "$1");
    var length = property.length;
    var a: number;
    var values: string = "";
    for (a = 0; a < length && values.length < 100; a++) {
      try {
        values += property[a].toString() + ", ";
      } catch (e) {
        try {
          values += Object.prototype.toString.call(property[a]);
        } catch (e) {

        }
      }
    }
    values = values.replace(/, $/, "");
    this.labelText = constructorName + "[" + values + "]";
  }
  protected $type_node(property: Node) {
    this.expandable = true;
    try {
      var nodeDescription = property.nodeName;
      if (property.nodeType == property.ELEMENT_NODE) {
        if ((<Element>property).id) {
          nodeDescription += "#" + (<Element>property).id;
        }
        if ((<Element>property).className) {
          nodeDescription += "#" + (<Element>property).className.trim().replace(/\s+/, ".");
        }
      }
      this.labelText = nodeDescription;
    } catch (e) {
      this._type = "object";
      this.$type_object(property);
    }
  }
  protected $type_null(property: null) {
    this.expandable = false;
    this.labelText = property || "null";
  }
  protected $type_number(property: number) {
    this.expandable = false;
    this.labelText = property.toString();
  }
  protected $type_object(property: object) {
    this.expandable = true;
    this.labelText = Object.prototype.toString.call(property).replace(/^\[object (.*)\]$/, "$1") + " { }";
  }
  protected $type_regexp(property: RegExp) {
    this.expandable = true;
    this.labelText = property.toString();
  }
  protected $type_string(property: string) {
    this.expandable = false;
    this.labelText = "\"" + property + "\"";
  }
  protected $type_symbol(property: symbol) {
    this.expandable = false;
    this.labelText = property.toString();
  }
  protected $type_undefined(property: undefined) {
    this.expandable = false;
    this.labelText = property || "undefined";
  }

  static get observedAttributes() {
    return [
      "type"
    ];
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "type":
        if (newValue != this.type) {
          this.setAttribute("type", this.type);
        }
        break;
    }
  }
}
customElements.define("mpc-property-expander", MPCPropertyExpanderElement);
