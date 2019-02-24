/// <reference path="../default.d.ts" />
/// <reference path="./expander.ts" />

class MPCNodeExpanderElement<T extends Node> extends MPCExpanderElement {
  static toType(n: Node) {
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

  constructor() {
    super();

    this.addEventListener("expand", event => {
      if (!this.$wasExpanded) {
        this.$getChildNodes();
        this.$wasExpanded = true;
      }
    });
  }

  protected $toType() {
    return MPCNodeExpanderElement.toType(this.$node);
  }

  protected $wasExpanded: boolean = false;

  private _type: string = "";
  public get type(): string {
    return this._type;
  }

  protected $node: T;
  public get node(): T {
    return this.$node;
  }
  public set node(value: T) {
    if ("$node" in this && this.$node === value) {
      return;
    }
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.$wasExpanded = false;
    this.expanded = false;
    if (
      "nodeName" in value &&
      "nodeType" in value &&
      "parentNode" in value &&
      "hasChildNodes" in value &&
      "childNodes" in value
    ) {
      this.$node = value;
      this.expandable = this.$node.hasChildNodes() || ("shadowRoot" in this.node && (<{ shadowRoot?: ShadowRoot }>this.node).shadowRoot !== null);

      this._type = this.$toType();
      this.setAttribute("type", this._type);

      if (("$type_" + this._type) in this) {
        this["$type_" + this._type](value);
      } else {
        this.labelText = this.$node.nodeName;
      }
    }
  }

  protected $getChildNodes() {
    if ("shadowRoot" in this.node && (<{ shadowRoot?: ShadowRoot }>this.node).shadowRoot) {
      var expander = <MPCNodeExpanderElement<ShadowRoot>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander");
      expander.node = (<{ shadowRoot?: ShadowRoot; }>this.node).shadowRoot;
      if (this.lastElementChild !== this.label) {
        this.insertBefore(expander, this.lastElementChild);
      } else {
        this.appendChild(expander);
      }
    }
    if (this.lastElementChild !== this.label) {
      this.node.childNodes.forEach(node => {
        if (MPCNodeExpanderElement.toType(node) == "text_node" && node.textContent.trim() == "") {
          return;
        }
        var expander = <MPCNodeExpanderElement<Node>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander");
        expander.node = node;
        this.insertBefore(expander, this.lastElementChild);
      });
    } else {
      this.node.childNodes.forEach(node => {
        if (MPCNodeExpanderElement.toType(node) == "text_node" && node.textContent.trim() == "") {
          return;
        }
        var expander = <MPCNodeExpanderElement<Node>>document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander");
        expander.node = node;
        this.appendChild(expander);
      });
    }
  }

  protected $type_element_node(node: Element) {
    this.labelText = "";
    var fragment = document.createDocumentFragment();
    fragment.appendChild(document.createTextNode("<"));

    var nodeName = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-tag");
    nodeName.textContent = node.nodeName;
    fragment.appendChild(nodeName);

    Array.prototype.forEach.call(node.attributes, (attribute: Attr) => {
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
    } else {
      fragment.appendChild(document.createTextNode(" />"));
    }
    this.label.appendChild(fragment);
  }

  protected $type_attribute_node(node: Attr) {
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

  protected $type_text_node(node: Text) {
    this.labelText = node.data;
  }

  protected $type_cdata_section_node(node: CDATASection) {
    this.labelText = "<![CDATA[" + node.data + "]]>";
  }

  protected $type_entity_reference_node(node: Node) {
    console.warn("Entity reference nodes are not supported");
    this.labelText = "&" + node.nodeValue + ";";
  }

  protected $type_entity_node(node: Node) {
    console.warn("Entity nodes are not supported");
    this.labelText = "<!ENTITY" + node.nodeValue + ">";
  }

  protected $type_processing_instruction_node(node: ProcessingInstruction) {
    this.labelText = "";
    var open = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-tag");
    open.textContent = "<?" + node.target;
    this.label.appendChild(open);
    this.label.appendChild(document.createTextNode(node.data));
    var close = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-tag");
    close.textContent = "?>";
    this.label.appendChild(close);
  }

  protected $type_comment_node(node: Comment) {
    this.labelText = "";
    var open = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-tag");
    open.textContent = "<!--";
    this.label.appendChild(open);
    this.label.appendChild(document.createTextNode(node.data));
    var close = document.createElementNS("http://www.w3.org/1999/xhtml", "mpc-node-expander-tag");
    close.textContent = "-->";
    this.label.appendChild(close);
  }

  protected $type_document_node(node: Document) {
    this.labelText = node.nodeName;
  }

  protected $type_document_type_node(node: DocumentType) {
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

  protected $type_document_fragment_node(node: DocumentFragment) {
    if (
      "host" in node &&
      "innerHTML" in node &&
      "mode" in node
    ) {
      this.labelText = "#shadow-root (" + (<ShadowRoot>node).mode + ")";
    } else {
      this.labelText = node.nodeName;
    }
  }

  protected $type_notation_node(node: Node) {
    console.warn("Notation nodes are not supported");
    this.$type_element_node(<Element>node);
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
customElements.define("mpc-node-expander", MPCNodeExpanderElement);