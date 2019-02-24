/// <reference path="../default.module.d.ts" />

/**
 * Übersetzungsmodul
 * @param text der zu übersetzende Text (mit Argumenten $0, $1, $2 ...)
 * @param namespace der für die Übersetzung zu benutzende Namensraum.
 *                  Wenn `namespace` leer ist, wird `text` nicht übersetzt
 * @param args maximal 10 Argumente ($0, $1, $2 ...)
 */
export function i18n(text: string, namespace: string = "", ...args: string[]): string {
  if (namespace in i18n._namespaces && text in i18n._namespaces[namespace]) {
    text = i18n._namespaces[namespace][text];
  }
  args.forEach((arg, index) => {
    text = text.replace(new RegExp("\\$" + index, "g"), arg);
  });
  return text;
}

export namespace i18n {
  /**
   * Die definierten Namensräume
   * @private
   */
  export const _namespaces: {
    /** Namensräume */
    [n: string]: {
      /** Übersetzungen */
      [s: string]: string
    }
  } = Object.create(null);

  /**
   * Fügt einen Namensraum hinzu
   * @param namespace der für die Übersetzung anzugebende Namensraum
   * @param translations die Übersetzungen als: { "orig": "trans" }
   */
  export function defineNamespace(namespace: string, translations: { [s: string]: string; }) {
    if (namespace == "") {
      throw "Namespace cannot be declared";
    }
    _namespaces[namespace] = _namespaces[namespace] || {};
    Object.assign(_namespaces[namespace], translations);
  }

  /**
   * `value` wird durch `$0` im Übersetzungstext angesprochen
   * @param value gibt an, welche Übersetzung gewählt werden soll
   * @param opt0 wenn `value` `0` ist, übersetze diesen Text
   * @param opt1 wenn `value` `1` ist, übersetze diesen Text
   * @param optN wenn `value` weder `0` noch `1` ist, übersetze diesen Text
   * @param namespace der für die Übersetzung anzugebende Namensraum
   */
  export function opt(value: number, opt0: string, opt1: string, optN: string, namespace: string = ""): string {
    var text = optN;
    if (value == 0) {
      text = opt0;
    } else if (value == 1) {
      text = opt1;
    }
    return i18n(text, namespace, value.toString());
  }
}