/// <reference path="../../ts/default.d.ts" />
/// <reference path="expander.d.ts" />
declare class MPCPropertyExpanderElement<T> extends MPCExpanderElement {
    static toType(o: any): string;
    constructor();
    protected $toType(): string;
    protected $wasExpanded: boolean;
    private _type;
    readonly type: string;
    protected $property: T;
    property: T;
    protected $propertySorter(a: PropertyKey, b: PropertyKey): 0 | 1 | -1;
    protected $getProperties(): void;
    protected $createValue(prop: {
        prototype: any;
        property: PropertyKey;
        descriptor: PropertyDescriptor;
    }): void;
    protected $createGet(prop: {
        prototype: any;
        property: PropertyKey;
        descriptor: PropertyDescriptor;
    }): void;
    protected $createGetter(prop: {
        prototype: any;
        property: PropertyKey;
        descriptor: PropertyDescriptor;
    }): void;
    protected $createSetter(prop: {
        prototype: any;
        property: PropertyKey;
        descriptor: PropertyDescriptor;
    }): void;
    protected $type_boolean(property: boolean): void;
    protected $type_function(property: Function): void;
    protected $type_iterable(property: {
        [i: number]: any;
        length: number;
    }): void;
    protected $type_node(property: Node): void;
    protected $type_null(property: null): void;
    protected $type_number(property: number): void;
    protected $type_object(property: object): void;
    protected $type_regexp(property: RegExp): void;
    protected $type_string(property: string): void;
    protected $type_symbol(property: symbol): void;
    protected $type_undefined(property: undefined): void;
    static readonly observedAttributes: string[];
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
//# sourceMappingURL=propertyexpander.d.ts.map