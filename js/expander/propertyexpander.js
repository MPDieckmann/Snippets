"use strict";
class MPCPropertyExpanderElement extends MPCExpanderElement {
    constructor() {
        super();
        this.$wasExpanded = false;
        this._type = "";
        this.addEventListener("expand", event => {
            if (!this.$wasExpanded) {
                this.$getProperties();
                this.$wasExpanded = true;
            }
        });
    }
    static toType(o) {
        var type = typeof o;
        if (type == "object") {
            try {
                if (o == null) {
                    return "null";
                }
                else if (o instanceof RegExp) {
                    return "regexp";
                }
                else if (o instanceof Node) {
                    return "node";
                }
                else if ("length" in o && typeof o.length == "number") {
                    return "iterable";
                }
            }
            catch (e) { }
        }
        return type;
    }
    $toType() {
        return MPCPropertyExpanderElement.toType(this.$property);
    }
    get type() {
        return this._type;
    }
    get property() {
        return this.$property;
    }
    set property(value) {
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
    $propertySorter(a, b) {
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
            }
            else if (a.charCodeAt(index) < b.charCodeAt(index)) {
                return -1;
            }
        }
        if (a.length > b.length) {
            return 1;
        }
        else if (a.length < b.length) {
            return -1;
        }
        return 0;
    }
    $getProperties() {
        var properties = new Map();
        var prototype = this.$property;
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
        } while (prototype = Object.getPrototypeOf(prototype) || prototype.__proto__);
        Array.from(properties.keys()).sort(this.$propertySorter).forEach(property => {
            var prop = properties.get(property);
            if ("value" in prop.descriptor) {
                this.$createValue(prop);
            }
            else {
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
    $createValue(prop) {
        var expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
        expander.property = prop.descriptor.value;
        if (!prop.descriptor.enumerable) {
            expander.label.style.opacity = "0.9";
        }
        this.appendChild(expander);
        var key = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander-key");
        key.textContent = prop.property.toString() + ": ";
        expander.label.insertBefore(key, expander.label.firstChild);
    }
    $createGet(prop) {
        var placeholder = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
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
            }
            catch (e) {
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
    $createGetter(prop) {
        if (prop.prototype == this.$property) {
            var expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
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
    $createSetter(prop) {
        if (prop.prototype == this.$property) {
            var expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-property-expander");
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
    $type_boolean(property) {
        this.expandable = false;
        this.labelText = property.toString();
    }
    $type_function(property) {
        this.expandable = true;
        var string = property.toString().replace(/\s+/g, " ").trim();
        if (/^class|function/.test(string)) {
            this.labelText = string.split("{", 1)[0] + "{ [code] }";
        }
        else if (/(?:^=>)*=> \{/.test(string)) {
            this.labelText = string.split("{", 1)[0] + "{ [code] }";
        }
        else if (/[^\)]*\) {/.test(string)) {
            this.labelText = string.split("{", 1)[0] + "{ [code] }";
        }
        else {
            this.labelText = string;
        }
    }
    $type_iterable(property) {
        this.expandable = true;
        var constructorName = Object.prototype.toString.call(property).replace(/^\[object (.*)\]$/, "$1");
        var length = property.length;
        var a;
        var values = "";
        for (a = 0; a < length && values.length < 100; a++) {
            try {
                values += property[a].toString() + ", ";
            }
            catch (e) {
                try {
                    values += Object.prototype.toString.call(property[a]);
                }
                catch (e) {
                }
            }
        }
        values = values.replace(/, $/, "");
        this.labelText = constructorName + "[" + values + "]";
    }
    $type_node(property) {
        this.expandable = true;
        try {
            var nodeDescription = property.nodeName;
            if (property.nodeType == property.ELEMENT_NODE) {
                if (property.id) {
                    nodeDescription += "#" + property.id;
                }
                if (property.className) {
                    nodeDescription += "#" + property.className.trim().replace(/\s+/, ".");
                }
            }
            this.labelText = nodeDescription;
        }
        catch (e) {
            this._type = "object";
            this.$type_object(property);
        }
    }
    $type_null(property) {
        this.expandable = false;
        this.labelText = property || "null";
    }
    $type_number(property) {
        this.expandable = false;
        this.labelText = property.toString();
    }
    $type_object(property) {
        this.expandable = true;
        this.labelText = Object.prototype.toString.call(property).replace(/^\[object (.*)\]$/, "$1") + " { }";
    }
    $type_regexp(property) {
        this.expandable = true;
        this.labelText = property.toString();
    }
    $type_string(property) {
        this.expandable = false;
        this.labelText = "\"" + property + "\"";
    }
    $type_symbol(property) {
        this.expandable = false;
        this.labelText = property.toString();
    }
    $type_undefined(property) {
        this.expandable = false;
        this.labelText = property || "undefined";
    }
    static get observedAttributes() {
        return [
            "type"
        ];
    }
    attributeChangedCallback(name, oldValue, newValue) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHlleHBhbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL2V4cGFuZGVyL3Byb3BlcnR5ZXhwYW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUdBLE1BQU0sMEJBQThCLFNBQVEsa0JBQWtCO0lBbUI1RDtRQUNFLEtBQUssRUFBRSxDQUFDO1FBY0EsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFFaEMsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQWR6QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN0QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2FBQzFCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBM0JELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBTTtRQUNsQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQztRQUNwQixJQUFJLElBQUksSUFBSSxRQUFRLEVBQUU7WUFDcEIsSUFBSTtnQkFDRixJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7b0JBQ2IsT0FBTyxNQUFNLENBQUM7aUJBQ2Y7cUJBQU0sSUFBSSxDQUFDLFlBQVksTUFBTSxFQUFFO29CQUM5QixPQUFPLFFBQVEsQ0FBQztpQkFDakI7cUJBQU0sSUFBSSxDQUFDLFlBQVksSUFBSSxFQUFFO29CQUM1QixPQUFPLE1BQU0sQ0FBQztpQkFDZjtxQkFBTSxJQUFJLFFBQVEsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsTUFBTSxJQUFJLFFBQVEsRUFBRTtvQkFDdkQsT0FBTyxVQUFVLENBQUM7aUJBQ25CO2FBQ0Y7WUFBQyxPQUFPLENBQUMsRUFBRSxHQUFHO1NBQ2hCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBYVMsT0FBTztRQUNmLE9B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