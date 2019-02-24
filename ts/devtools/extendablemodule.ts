/// <reference path="../default.d.ts" />

class ExtendableModule {
  public element = document.createElement("module");
  public header = document.createElement("button");
  protected constructor(options: ExtendableModule.Options) {
    this.element.setAttribute("type", options.type);
  }
  public onfocus() { }
  public onblur() { }
}
declare namespace ExtendableModule {
  interface Options {
    name: string,
    type: string
  }
}
