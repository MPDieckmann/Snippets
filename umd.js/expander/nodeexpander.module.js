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
    class MPCNodeExpanderElement extends expander_module_1.MPCExpanderElement {
        constructor() {
            super();
            this.$wasExpanded = false;
            this._type = "";
            this.addEventListener("expand", event => {
                if (!this.$wasExpanded) {
                    this.$getChildNodes();
                    this.$wasExpanded = true;
                }
            });
        }
        static toType(n) {
            switch (n.nodeType) {
                case n.ELEMENT_NODE:
                    return "element_node";
                case n.ATTRIBUTE_NODE:
                    return "attribute_node";
                case n.TEXT_NODE:
                    return "text_node";
                case n.CDATA_SECTION_NODE:
                    return "cdata_section_node";
                case n.ENTITY_REFERENCE_NODE:
                    return "entity_reference_node";
                case n.ENTITY_NODE:
                    return "entity_node";
                case n.PROCESSING_INSTRUCTION_NODE:
                    return "processing_instruction_node";
                case n.COMMENT_NODE:
                    return "comment_node";
                case n.DOCUMENT_NODE:
                    return "document_node";
                case n.DOCUMENT_TYPE_NODE:
                    return "document_type_node";
                case n.DOCUMENT_FRAGMENT_NODE:
                    return "document_fragment_node";
                case n.NOTATION_NODE:
                    return "notation_node";
                default:
                    throw "Cannot handle type of node: " + n.nodeType;
            }
        }
        $toType() {
            return MPCNodeExpanderElement.toType(this.$node);
        }
        get type() {
            return this._type;
        }
        get node() {
            return this.$node;
        }
        set node(value) {
            if ("$node" in this && this.$node === value) {
                return;
            }
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }
            this.$wasExpanded = false;
            this.expanded = false;
            if ("nodeName" in value &&
                "nodeType" in value &&
                "parentNode" in value &&
                "hasChildNodes" in value &&
                "childNodes" in value) {
                this.$node = value;
                this.expandable = this.$node.hasChildNodes() || ("shadowRoot" in this.node && this.node.shadowRoot !== null);
                this._type = this.$toType();
                this.setAttribute("type", this._type);
                if (("$type_" + this._type) in this) {
                    this["$type_" + this._type](value);
                }
                else {
                    this.labelText = this.$node.nodeName;
                }
            }
        }
        $getChildNodes() {
            if ("shadowRoot" in this.node && this.node.shadowRoot) {
                var expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander");
                expander.node = this.node.shadowRoot;
                if (this.lastElementChild !== this.label) {
                    this.insertBefore(expander, this.lastElementChild);
                }
                else {
                    this.appendChild(expander);
                }
            }
            if (this.lastElementChild !== this.label) {
                this.node.childNodes.forEach(node => {
                    if (MPCNodeExpanderElement.toType(node) == "text_node" && node.textContent.trim() == "") {
                        return;
                    }
                    var expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander");
                    expander.node = node;
                    this.insertBefore(expander, this.lastElementChild);
                });
            }
            else {
                this.node.childNodes.forEach(node => {
                    if (MPCNodeExpanderElement.toType(node) == "text_node" && node.textContent.trim() == "") {
                        return;
                    }
                    var expander = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander");
                    expander.node = node;
                    this.appendChild(expander);
                });
            }
        }
        $type_element_node(node) {
            this.labelText = "";
            var fragment = document.createDocumentFragment();
            fragment.appendChild(document.createTextNode("<"));
            var nodeName = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-tag");
            nodeName.textContent = node.nodeName;
            fragment.appendChild(nodeName);
            Array.prototype.forEach.call(node.attributes, (attribute) => {
                fragment.appendChild(document.createTextNode(" "));
                var attrName = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-name");
                attrName.textContent = attribute.name;
                fragment.appendChild(attrName);
                if (attribute.value) {
                    fragment.appendChild(document.createTextNode("=\""));
                    var attrValue = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-value");
                    attrValue.textContent = attribute.value;
                    fragment.appendChild(attrValue);
                    fragment.appendChild(document.createTextNode("\""));
                }
            });
            if (this.expandable) {
                fragment.appendChild(document.createTextNode(">"));
                var label = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-expander-label");
                label.appendChild(document.createTextNode("</"));
                label.appendChild(nodeName.cloneNode(true));
                label.appendChild(document.createTextNode(">"));
                this.appendChild(label);
            }
            else {
                fragment.appendChild(document.createTextNode(" />"));
            }
            this.label.appendChild(fragment);
        }
        $type_attribute_node(node) {
            this.labelText = "";
            this.label.appendChild(document.createTextNode(" "));
            var attrName = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-name");
            attrName.textContent = node.name;
            this.label.appendChild(attrName);
            if (node.value) {
                this.label.appendChild(document.createTextNode("=\""));
                var attrValue = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-value");
                attrValue.textContent = node.value;
                this.label.appendChild(attrValue);
                this.label.appendChild(document.createTextNode("\""));
            }
        }
        $type_text_node(node) {
            this.labelText = node.data;
        }
        $type_cdata_section_node(node) {
            this.labelText = "<![CDATA[" + node.data + "]]>";
        }
        $type_entity_reference_node(node) {
            console.warn("Entity reference nodes are not supported");
            this.labelText = "&" + node.nodeValue + ";";
        }
        $type_entity_node(node) {
            console.warn("Entity nodes are not supported");
            this.labelText = "<!ENTITY" + node.nodeValue + ">";
        }
        $type_processing_instruction_node(node) {
            this.labelText = "";
            var open = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-tag");
            open.textContent = "<?" + node.target;
            this.label.appendChild(open);
            this.label.appendChild(document.createTextNode(node.data));
            var close = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-tag");
            close.textContent = "?>";
            this.label.appendChild(close);
        }
        $type_comment_node(node) {
            this.labelText = "";
            var open = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-tag");
            open.textContent = "<!--";
            this.label.appendChild(open);
            this.label.appendChild(document.createTextNode(node.data));
            var close = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-tag");
            close.textContent = "-->";
            this.label.appendChild(close);
        }
        $type_document_node(node) {
            this.labelText = node.nodeName;
        }
        $type_document_type_node(node) {
            this.labelText = "";
            var open = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-tag");
            open.textContent = "<!DOCTYPE";
            this.label.appendChild(open);
            this.label.appendChild(document.createTextNode(" "));
            var name = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-name");
            name.textContent = node.name;
            this.label.appendChild(name);
            if (node.systemId) {
                this.label.appendChild(document.createTextNode(" SYSTEM \""));
                var attrValue = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-value");
                attrValue.textContent = node.systemId;
                this.label.appendChild(attrValue);
                this.label.appendChild(document.createTextNode("\""));
            }
            if (node.publicId) {
                this.label.appendChild(document.createTextNode(" PUBLIC \""));
                var attrValue = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-value");
                attrValue.textContent = node.publicId;
                this.label.appendChild(attrValue);
                this.label.appendChild(document.createTextNode("\""));
            }
            var close = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-tag");
            close.textContent = ">";
            this.label.appendChild(close);
        }
        $type_document_fragment_node(node) {
            if ("host" in node &&
                "innerHTML" in node &&
                "mode" in node) {
                this.labelText = "#shadow-root (" + node.mode + ")";
            }
            else {
                this.labelText = node.nodeName;
            }
        }
        $type_notation_node(node) {
            console.warn("Notation nodes are not supported");
            this.$type_element_node(node);
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
    exports.MPCNodeExpanderElement = MPCNodeExpanderElement;
    customElements.define("mpc-node-expander", MPCNodeExpanderElement);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZWV4cGFuZGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL2V4cGFuZGVyL25vZGVleHBhbmRlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFFQSx1REFBdUQ7SUFFdkQsTUFBYSxzQkFBdUMsU0FBUSxvQ0FBa0I7UUFnQzVFO1lBQ0UsS0FBSyxFQUFFLENBQUM7WUFjQSxpQkFBWSxHQUFZLEtBQUssQ0FBQztZQUVoQyxVQUFLLEdBQVcsRUFBRSxDQUFDO1lBZHpCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO29CQUN0QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2lCQUMxQjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQXhDRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQU87WUFDbkIsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFO2dCQUNsQixLQUFLLENBQUMsQ0FBQyxZQUFZO29CQUNqQixPQUFPLGNBQWMsQ0FBQztnQkFDeEIsS0FBSyxDQUFDLENBQUMsY0FBYztvQkFDbkIsT0FBTyxnQkFBZ0IsQ0FBQztnQkFDMUIsS0FBSyxDQUFDLENBQUMsU0FBUztvQkFDZCxPQUFPLFdBQVcsQ0FBQztnQkFDckIsS0FBSyxDQUFDLENBQUMsa0JBQWtCO29CQUN2QixPQUFPLG9CQUFvQixDQUFDO2dCQUM5QixLQUFLLENBQUMsQ0FBQyxxQkFBcUI7b0JBQzFCLE9BQU8sdUJBQXVCLENBQUM7Z0JBQ2pDLEtBQUssQ0FBQyxDQUFDLFdBQVc7b0JBQ2hCLE9BQU8sYUFBYSxDQUFDO2dCQUN2QixLQUFLLENBQUMsQ0FBQywyQkFBMkI7b0JBQ2hDLE9BQU8sNkJBQTZCLENBQUM7Z0JBQ3ZDLEtBQUssQ0FB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