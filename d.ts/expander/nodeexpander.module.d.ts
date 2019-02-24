/// <reference path="../../ts/default.module.d.ts" />
import { MPCExpanderElement } from "./expander.module";
export declare class MPCNodeExpanderElement<T extends Node> extends MPCExpanderElement {
    static toType(n: Node): "element_node" | "attribute_node" | "text_node" | "cdata_section_node" | "entity_reference_node" | "entity_node" | "processing_instruction_node" | "comment_node" | "document_node" | "document_type_node" | "document_fragment_node" | "notation_node";
    constructor();
    protected $toType(): "element_node" | "attribute_node" | "text_node" | "cdata_section_node" | "entity_reference_node" | "entity_node" | "processing_instruction_node" | "comment_node" | "document_node" | "document_type_node" | "document_fragment_node" | "notation_node";
    protected $wasExpanded: boolean;
    private _type;
    readonly type: string;
    protected $node: T;
    node: T;
    protected $getChildNodes(): void;
    protected $type_element_node(node: Element): void;
    protected $type_attribute_node(node: Attr): void;
    protected $type_text_node(node: Text): void;
    protected $type_cdata_section_node(node: CDATASection): void;
    protected $type_entity_reference_node(node: Node): void;
    protected $type_entity_node(node: Node): void;
    protected $type_processing_instruction_node(node: ProcessingInstruction): void;
    protected $type_comment_node(node: Comment): void;
    protected $type_document_node(node: Document): void;
    protected $type_document_type_node(node: DocumentType): void;
    protected $type_document_fragment_node(node: DocumentFragment): void;
    protected $type_notation_node(node: Node): void;
    static readonly observedAttributes: string[];
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
//# sourceMappingURL=nodeexpander.module.d.ts.map