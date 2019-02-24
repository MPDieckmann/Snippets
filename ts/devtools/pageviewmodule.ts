/// <reference path="../default.d.ts" />
/// <reference path="./extendablemodule.ts" />
/// <reference path="./consolemodule.ts" />

class PageViewModule extends ExtendableModule {
  public iframe: HTMLIFrameElement;
  public console: ConsoleModule;
  constructor(url: string = "about:blank") {
    super({
      name: "PageView",
      type: "pageview"
    });

    this.iframe = document.createElement("iframe");
    this.iframe.src = url;
    this.console = new ConsoleModule();

    this.iframe.addEventListener("load", () => {
      if (this.iframe.contentWindow) {
        this.console.bind(this.iframe.contentWindow);
      }
    });

    this.element.appendChild(this.iframe);
  }
}