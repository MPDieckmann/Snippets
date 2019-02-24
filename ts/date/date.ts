/// <reference path="../default.d.ts" />
/// <reference path="../i18n/i18n.ts" />

/**
 * replace i18n, if it is not available
 */
// @ts-ignore
 var i18n: (text: string) => string = i18n || ((text: string) => text.toString());

/**
 * Formatiert ein(e) angegebene(s) Ortszeit/Datum gemäß PHP 7
 * @param string die Zeichenfolge, die umgewandelt wird
 * @param timestamp der zu verwendende Zeitpunkt
 */
function date(string: string, timestamp: number | string | Date = new Date): string {
  var d = (timestamp instanceof Date) ? timestamp : new Date(timestamp);
  return string.split("").map(string => string in date._functions ? date._functions[string](d).toString() : string).join("");
}
namespace date {
  /**
   * Diese Zeichenfolgen werden von `date()` benutzt um die Wochentage darzustellen
   * 
   * Sie werden von `i18n(weekdays[i] , "mpc")` übersetzt
   */
  export const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  /**
   * Diese Zeichenfolgen werden von `date()` benutzt um die Monate darzustellen
   * 
   * Sie werden von `i18n(months[i] , "mpc")` übersetzt
   */
  export const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  /**
   * Gibt die aktuelle Zeit und Datum in Millisekunden aus.
   * @param timestamp Zahl oder `Date`-Objekt/Zeichenfolge um nicht die aktuelle Zeit zu verwenden
   */
  export function time(timestamp: number | string | Date = new Date): number {
    var d = (timestamp instanceof Date) ? timestamp : new Date(timestamp);
    return d.getTime();
  }

  /**
   * Die verwendeten Funktionen zur mwandlung der Buchstaben
   * @private
   */
  export const _functions: {
    [s: string]: (d: Date) => string | number;
  } = Object.create(null);

  /**
   * Fügt einer Zahl eine führende 0 hinzu, wenn sie kleiner als 10 ist
   * @param value Zahl, der eine führende 0 hinzugefügt werden soll
   * @private
   */
  export function _leadingZero(value: number): string {
    return value < 10 ? "0" + value : value.toString();
  }

  // #region Tag
  /**
   * Tag des Monats, 2-stellig mit führender Null
   * 01 bis 31
   */
  _functions.d = date => {
    return _leadingZero(date.getDate());
  };
  /**
   * Wochentag, gekürzt auf drei Buchstaben
   * Mon bis Sun
   */
  _functions.D = date => {
    return i18n(weekdays[date.getDay()], "mpc").substr(0, 3);
  }
  /**
   * Tag des Monats ohne führende Nullen
   * 1 bis 31
   */
  _functions.j = date => {
    return date.getDate();
  }
  /**
   * Ausgeschriebener Wochentag
   * Sunday bis Saturday
   */
  _functions.l = date => {
    return i18n(weekdays[date.getDay()], "mpc");
  };
  /**
   * Numerische Repräsentation des Wochentages gemäß ISO-8601 (in PHP 5.1.0 hinzugefügt)
   * 1 (für Montag) bis 7 (für Sonntag)
   */
  _functions.N = date => {
    return date.getDay() == 0 ? 7 : date.getDay();
  };
  /**
   * Anhang der englischen Aufzählung für einen Monatstag, zwei Zeichen
   * st, nd, rd oder th
   * Zur Verwendung mit j empfohlen.
   */
  _functions.S = date => {
    switch (date.getDate()) {
      case 1:
        return i18n("st", "mpc");
      case 2:
        return i18n("nd", "mpc");
      case 3:
        return i18n("rd", "mpc");
      default:
        return i18n("th", "mpc");
    }
  };
  /**
   * Numerischer Tag einer Woche
   * 0 (für Sonntag) bis 6 (für Samstag)
   */
  _functions.w = date => {
    return 7 == date.getDay() ? 0 : date.getDay();
  }
  /**
   * Der Tag des Jahres (von 0 beginnend)
   * 0 bis 366
   */
  _functions.z = date => {
    return Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 864e5).toString();
  };
  // #endregion

  // #region Woche
  /**
   * Der Tag des Jahres (von 0 beginnend)
   * Beispiel: 42 (die 42. Woche im Jahr)
   */
  _functions.W = date => {
    var tmp_date = new Date(date.getTime() + 864e5 * (3 - (date.getDay() + 6) % 7));
    return Math.floor(1.5 + (tmp_date.getTime() - new Date(new Date(tmp_date.getFullYear(), 0, 4).getTime() + 864e5 * (3 - (new Date(tmp_date.getFullYear(), 0, 4).getDay() + 6) % 7)).getTime()) / 864e5 / 7);
  };
  // #endregion

  // #region Monat
  /**
   * Monat als ganzes Wort, wie January oder March
   * January bis December
   */
  _functions.F = date => {
    return i18n(months[date.getMonth()], "mpc");
  };
  /**
   * Monat als Zahl, mit führenden Nullen
   * 01 bis 12
   */
  _functions.m = date => {
    return _leadingZero(date.getMonth() + 1);
  };
  /**
   * Monatsname mit drei Buchstaben
   * Jan bis Dec
   */
  _functions.M = date => {
    return i18n(months[date.getMonth()], "mpc").substr(0, 3);
  };
  /**
   * Monatszahl, ohne führende Nullen
   * 1 bis 12
   */
  _functions.n = date => {
    return date.getMonth() + 1;
  };
  /**
   * Anzahl der Tage des angegebenen Monats
   * 28 bis 31
   */
  _functions.t = date => {
    return 2 != date.getMonth() ? 9 == date.getMonth() || 4 == date.getMonth() || 6 == date.getMonth() || 11 == date.getMonth() ? "30" : "31" : date.getFullYear() % 4 == 0 && date.getFullYear() % 100 != 0 ? "29" : "28";
  };
  // #endregion

  // #region Jahr
  /**
   * Schaltjahr oder nicht
   * 1 für ein Schaltjahr, ansonsten 0
   */
  _functions.L = date => {
    return date.getFullYear() % 4 == 0 && date.getFullYear() % 100 != 0 ? 1 : 0;
  };
  /**
   * Jahreszahl der Kalenderwoche gemäß ISO-8601. Dies ergibt den gleichen Wert wie Y, außer wenn die ISO-Kalenderwoche (W) zum vorhergehenden oder nächsten Jahr gehört, wobei dann jenes Jahr verwendet wird (in PHP 5.1.0 hinzugefügt).
   * Beispiele: 1999 oder 2003
   */
  _functions.o = date => {
    var tmp_d = new Date(date.toISOString());
    tmp_d.setDate(date.getDate() - (date.getDay() == 0 ? 7 : date.getDay()) + 1);
    return tmp_d.getFullYear();
  }
  /**
   * Vierstellige Jahreszahl
   * Beispiele: 1999 oder 2003
   */
  _functions.Y = date => {
    return date.getFullYear();
  };
  /**
   * Jahreszahl, zweistellig
   * Beispiele: 99 oder 03
   */
  _functions.y = date => {
    var year = date.getFullYear().toString();
    return year.substr(year.length - 2, 2);
  };
  // #endregion

  // #region Uhrzeit
  /**
   * Kleingeschrieben: Ante meridiem (Vormittag) und Post meridiem (Nachmittag)
   * am oder pm
   */
  _functions.a = date => {
    if (date.getHours() > 12) {
      return i18n("pm", "mpc");
    }
    return i18n("am", "mpc");
  };
  /**
   * Großgeschrieben: Ante meridiem (Vormittag) und Post meridiem (Nachmittag)
   * AM oder PM
   */
  _functions.A = date => {
    if (date.getHours() > 12) {
      return i18n("PM", "mpc");
    }
    return i18n("AM", "mpc");
  };
  /**
   * Swatch-Internet-Zeit
   * 000 - 999
   */
  _functions.B = () => {
    console.error("date(): B is currently not supported");
    return "B";
  };
  /**
   * Stunde im 12-Stunden-Format, ohne führende Nullen
   * 1 bis 12
   */
  _functions.g = date => {
    return date.getHours() > 12 ? date.getHours() - 11 : date.getHours() + 1;
  };
  /**
   * Stunde im 24-Stunden-Format, ohne führende Nullen
   * 0 bis 23
   */
  _functions.G = date => {
    return date.getHours() + 1;
  };
  /**
   * Stunde im 12-Stunden-Format, mit führenden Nullen
   * 01 bis 12
   */
  _functions.h = date => {
    return _leadingZero(date.getHours() > 12 ? date.getHours() - 11 : date.getHours() + 1);
  };
  /**
   * Stunde im 24-Stunden-Format, mit führenden Nullen
   * 00 bis 23
   */
  _functions.H = date => {
    return _leadingZero(date.getHours() + 1);
  };
  /**
   * Minuten, mit führenden Nullen
   * 00 bis 59
   */
  _functions.i = date => {
    return _leadingZero(date.getMinutes());
  };
  /**
   * Sekunden, mit führenden Nullen
   * 00 bis 59
   */
  _functions.s = date => {
    return _leadingZero(date.getSeconds());
  };
  /**
   * Mikrosekunden (hinzugefügt in PHP 5.2.2). Beachten Sie, dass date() immer die Ausgabe 000000 erzeugen wird, da es einen Integer als Parameter erhält, wohingegen DateTime::format() Mikrosekunden unterstützt, wenn DateTime mit Mikrosekunden erzeugt wurde.
   * Beispiel: 654321
   */
  _functions.u = date => {
    return date.getMilliseconds();
  };
  /**
   * Millisekunden (hinzugefügt in PHP 7.0.0). Es gelten die selben Anmerkungen wie für u.
   * Example: 654
   */
  _functions.v = date => {
    return date.getMilliseconds();
  };
  // #endregion

  // #region Zeitzone
  _functions.e = () => {
    console.error("date(): e is currently not supported");
    return "e";
  };
  /**
   * Fällt ein Datum in die Sommerzeit
   * 1 bei Sommerzeit, ansonsten 0.
   */
  _functions.I = () => {
    console.error("date(): I is currently not supported");
    return "I";
  };
  /**
   * Zeitunterschied zur Greenwich time (GMT) in Stunden
   * Beispiel: +0200
   */
  _functions.O = () => {
    console.error("date(): O is currently not supported");
    return "O";
  }
  /**
   * Zeitunterschied zur Greenwich time (GMT) in Stunden mit Doppelpunkt zwischen Stunden und Minuten (hinzugefügt in PHP 5.1.3)
   * Beispiel: +02:00
   */
  _functions.P = () => {
    console.error("date(): P is currently not supported");
    return "P";
  }
  /**
   * Abkürzung der Zeitzone
   * Beispiele: EST, MDT ...
   */
  _functions.T = () => {
    console.error("date(): T is currently not supported");
    return "T";
  }
  /**
   * Offset der Zeitzone in Sekunden. Der Offset für Zeitzonen westlich von UTC ist immer negativ und für Zeitzonen östlich von UTC immer positiv.
   * -43200 bis 50400
   */
  _functions.Z = () => {
    console.error("date(): Z is currently not supported");
    return "Z";
  }
  // #endregion

  // #region Vollständige(s) Datum/Uhrzeit
  /**
   * ISO 8601 Datum (hinzugefügt in PHP 5)
   * 2004-02-12T15:19:21+00:00
   */
  _functions.c = () => {
    console.error("date(): c is currently not supported");
    return "c";
  }
  /**
   * Gemäß » RFC 2822 formatiertes Datum
   * Beispiel: Thu, 21 Dec 2000 16:01:07 +0200
   */
  _functions.r = () => {
    console.error("date(): r is currently not supported");
    return "r";
  }
  /**
   * Sekunden seit Beginn der UNIX-Epoche (January 1 1970 00:00:00 GMT)
   * Siehe auch time()
   */
  _functions.U = date => {
    return date.getTime();
  };
  // #endregion
}
