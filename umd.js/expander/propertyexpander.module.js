(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./expander.module"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const expander_module_1 = require("./expander.module");
    class MPCPropertyExpanderElement extends expander_module_1.MPCExpanderElement {
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
    exports.MPCPropertyExpanderElement = MPCPropertyExpanderElement;
    customElements.define("mpc-property-expander", MPCPropertyExpanderElement);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHlleHBhbmRlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9leHBhbmRlci9wcm9wZXJ0eWV4cGFuZGVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUVBLHVEQUF1RDtJQUV2RCxNQUFhLDBCQUE4QixTQUFRLG9DQUFrQjtRQW1CbkU7WUFDRSxLQUFLLEVBQUUsQ0FBQztZQWNBLGlCQUFZLEdBQVksS0FBSyxDQUFDO1lBRWhDLFVBQUssR0FBVyxFQUFFLENBQUM7WUFkekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7b0JBQ3RCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7aUJBQzFCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBM0JELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBTTtZQUNsQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQztZQUNwQixJQUFJLElBQUksSUFBSSxRQUFRLEVBQUU7Z0JBQ3BCLElBQUk7b0JBQ0YsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO3dCQUNiLE9BQU8sTUFBTSxDQUFDO3FCQUNmO3lCQUFNLElBQUksQ0FBQyxZQUFZLE1BQU0sRUFBRTt3QkFDOUIsT0FBTyxRQUFRLENBQUM7cUJBQ2pCO3lCQUFNLElBQUksQ0FBQyxZQUFZLElBQUksRUFBRTt3QkFDNUIsT0FBTyxNQUFNLENBQUM7cUJBQ2Y7eUJBQU0sSUFBSSxRQUFRLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE1BQU0sSUFBSSxRQUFRLEVBQUU7d0JBQ3ZELE9BQU8sVUFBVSxDQUFDO3FCQUNuQjtpQkFDRjtnQkFBQyxPQUFPLENBQUMsRUFBRSxHQUFHO2FBQ2hCO1lBQ0Qs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