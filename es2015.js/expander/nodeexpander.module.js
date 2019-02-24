import { MPCExpanderElement } from "./expander.module";
export class MPCNodeExpanderElement extends MPCExpanderElement {
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
customElements.define("mpc-node-expander", MPCNodeExpanderElement);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZWV4cGFuZGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL2V4cGFuZGVyL25vZGVleHBhbmRlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFdkQsTUFBTSxPQUFPLHNCQUF1QyxTQUFRLGtCQUFrQjtJQWdDNUU7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQWNBLGlCQUFZLEdBQVksS0FBSyxDQUFDO1FBRWhDLFVBQUssR0FBVyxFQUFFLENBQUM7UUFkekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUN0QyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDdEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQzthQUMxQjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQXhDRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQU87UUFDbkIsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFO1lBQ2xCLEtBQUssQ0FBQyxDQUFDLFlBQVk7Z0JBQ2pCLE9BQU8sY0FBYyxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxDQUFDLGNBQWM7Z0JBQ25CLE9BQU8sZ0JBQWdCLENBQUM7WUFDMUIsS0FBSyxDQUFDLENBQUMsU0FBUztnQkFDZCxPQUFPLFdBQVcsQ0FBQztZQUNyQixLQUFLLENBQUMsQ0FBQyxrQkFBa0I7Z0JBQ3ZCLE9BQU8sb0JBQW9CLENBQUM7WUFDOUIsS0FBSyxDQUFDLENBQUMscUJBQXFCO2dCQUMxQixPQUFPLHVCQUF1QixDQUFDO1lBQ2pDLEtBQUssQ0FBQyxDQUFDLFdBQVc7Z0JBQ2hCLE9BQU8sYUFBYSxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxDQUFDLDJCQUEyQjtnQkFDaEMsT0FBTyw2QkFBNkIsQ0FBQztZQUN2QyxLQUFLLENBQUMsQ0FBQyxZQUFZO2dCQUNqQixPQUFPLGNBQWMsQ0FBQztZQUN4QixLQUFLLENBQUMsQ0FBQyxhQUFhO2dCQUNsQixPQUFPLGVBQWUsQ0FBQztZQUN6QixLQUFLLENBQUMsQ0FBQyxrQkFBa0I7Z0JBQ3ZCLE9BQU8sb0JBQW9CLENBQUM7WUFDOUIsS0FBSyxDQUFDLENBQUMsc0JBQXNCO2dCQUMzQixPQUFPLHdCQUF3QixDQUFDO1lBQ2xDLEtBQUssQ0FBQyxDQUFDLGFBQWE7Z0JBQ2xCLE9BQU8sZUFBZSxDQUFDO1lBQ3pCO2dCQUNFLE1BQU0sOEJBQThCLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztTQUNyRDtJQUNILENBQUM7SUFhUyxPQUFPO1FBQ2YsT0FBTyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFLRCxJQUFXLElBQUk7UUFDYixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUdELElBQVcsSUFBSTtRQUNiLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBQ0QsSUFBVyxJQUFJLENBQUMsS0FBUTtRQUN0QixJQUFJLE9BQU8sSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLEVBQUU7WUFDM0MsT0FBTztTQUNSO1FBQ0QsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFDRSxVQUFVLElBQUksS0FBSztZQUNuQixVQUFVLElBQUksS0FBSztZQUNuQixZQUFZLElBQUksS0FBSztZQUNyQixlQUFlLElBQUksS0FBSztZQUN4QixZQUFZLElBQUksS0FBSyxFQUNyQjtZQUNBLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFrQyxJQUFJLENBQUMsSUFBSyxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUU1SSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFO2dCQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNwQztpQkFBTTtnQkFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2FBQ3RDO1NBQ0Y7SUFDSCxDQUFDO0lBRVMsY0FBYztRQUN0QixJQUFJLFlBQVksSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFrQyxJQUFJLENBQUMsSUFBSyxDQUFDLFVBQVUsRUFBRTtZQUNwRixJQUFJLFFBQVEsR0FBdUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1lBQ2pJLFFBQVEsQ0FBQyxJQUFJLEdBQWtDLElBQUksQ0FBQyxJQUFLLENBQUMsVUFBVSxDQUFDO1lBQ3JFLElBQUksSUFBSSxDQUFDLGdCQUFnQixLQUFLLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQ3BEO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDNUI7U0FDRjtRQUNELElBQUksSUFBSSxDQUFDLGdCQUFnQixLQUFLLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNsQyxJQUFJLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUU7b0JBQ3ZGLE9BQU87aUJBQ1I7Z0JBQ0QsSUFBSSxRQUFRLEdBQWlDLFFBQVEsQ0FBQyxlQUFlLENBQUMsOEJBQThCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztnQkFDM0gsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDbEMsSUFBSSxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFO29CQUN2RixPQUFPO2lCQUNSO2dCQUNELElBQUksUUFBUSxHQUFpQyxRQUFRLENBQUMsZUFBZSxDQUFDLDhCQUE4QixFQUFFLG1CQUFtQixDQUFDLENBQUM7Z0JBQzNILFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRVMsa0JBQWtCLENBQUMsSUFBYTtRQUN4QyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNwQixJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUNqRCxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUVuRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLDhCQUE4QixFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFDakcsUUFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3JDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFL0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFlLEVBQUUsRUFBRTtZQUNoRSxRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNuRCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLDhCQUE4QixFQUFFLHdCQUF3QixDQUFDLENBQUM7WUFDbEcsUUFBUSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQ3RDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFL0IsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFO2dCQUNuQixRQUFRLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDckQsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO2dCQUNwRyxTQUFTLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7Z0JBQ3hDLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2hDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ3JEO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkQsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO1lBQzNGLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pELEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzVDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDekI7YUFBTTtZQUNMLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ3REO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVTLG9CQUFvQixDQUFDLElBQVU7UUFDdkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsOEJBQThCLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUNsRyxRQUFRLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFakMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2QsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsOEJBQThCLEVBQUUseUJBQXlCLENBQUMsQ0FBQztZQUNwRyxTQUFTLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3ZEO0lBQ0gsQ0FBQztJQUVTLGVBQWUsQ0FBQyxJQUFVO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUM3QixDQUFDO0lBRVMsd0JBQXdCLENBQUMsSUFBa0I7UUFDbkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDbkQsQ0FBQztJQUVTLDJCQUEyQixDQUFDLElBQVU7UUFDOUMsT0FBTyxDQUFDLElBQUksQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0lBQzlDLENBQUM7SUFFUyxpQkFBaUIsQ0FBQyxJQUFVO1FBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztJQUNyRCxDQUFDO0lBRVMsaUNBQWlDLENBQUMsSUFBMkI7UUFDckUsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQzdGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMzRCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLDhCQUE4QixFQUFFLHVCQUF1QixDQUFDLENBQUM7UUFDOUYsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVTLGtCQUFrQixDQUFDLElBQWE7UUFDeEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQzdGLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDM0QsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQzlGLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFUyxtQkFBbUIsQ0FBQyxJQUFjO1FBQzFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNqQyxDQUFDO0lBRVMsd0JBQXdCLENBQUMsSUFBa0I7UUFDbkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQzdGLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUVyRCxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLDhCQUE4QixFQUFFLHdCQUF3QixDQUFDLENBQUM7UUFDOUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDOUQsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3BHLFNBQVMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDdkQ7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQzlELElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsOEJBQThCLEVBQUUseUJBQXlCLENBQUMsQ0FBQztZQUNwRyxTQUFTLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDdEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ3ZEO1FBRUQsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyw4QkFBOEIsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQzlGLEtBQUssQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFUyw0QkFBNEIsQ0FBQyxJQUFzQjtRQUMzRCxJQUNFLE1BQU0sSUFBSSxJQUFJO1lBQ2QsV0FBVyxJQUFJLElBQUk7WUFDbkIsTUFBTSxJQUFJLElBQUksRUFDZDtZQUNBLElBQUksQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCLEdBQWdCLElBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ25FO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDaEM7SUFDSCxDQUFDO0lBRVMsbUJBQW1CLENBQUMsSUFBVTtRQUN0QyxPQUFPLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLGtCQUFrQixDQUFVLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxNQUFNLEtBQUssa0JBQWtCO1FBQzNCLE9BQU87WUFDTCxNQUFNO1NBQ1AsQ0FBQztJQUNKLENBQUM7SUFDRCx3QkFBd0IsQ0FBQyxJQUFZLEVBQUUsUUFBZ0IsRUFBRSxRQUFnQjtRQUN2RSxRQUFRLElBQUksRUFBRTtZQUNaLEtBQUssTUFBTTtnQkFDVCxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO29CQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3RDO2dCQUNELE1BQU07U0FDVDtJQUNILENBQUM7Q0FDRjtBQUNELGNBQWMsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsc0JBQXNCLENBQUMsQ0FBQyJ9