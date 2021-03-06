(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./date.i18n-de.module", "./date.module"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("./date.i18n-de.module");
    const date_module_1 = require("./date.module");
    function test_date() {
        var date_s = new Date();
        var s = "abcdefghijklmnopqrstuvwxyz";
        var desc_s = {
            "d": "<ins>Tag des Monats, 2-stellig mit führender Null</ins>\n<i>01 bis 31</i>",
            "D": "<ins>Wochentag, gekürzt auf drei Buchstaben</ins>\n<i>Mon bis Sun</i>",
            "j": "<ins>Tag des Monats ohne führende Nullen</ins>\n<i>1 bis 31</i>",
            "l": "<ins>Ausgeschriebener Wochentag</ins>\n<i>Sunday bis Saturday</i>",
            "N": "<ins>Numerische Repräsentation des Wochentages gemäß ISO-8601 (in PHP 5.1.0 hinzugefügt)</ins>\n<i>1 (für Montag) bis 7 (für Sonntag)</i>",
            "S": "<ins>Anhang der englischen Aufzählung für einen Monatstag, zwei Zeichen</ins>\n<i>st, nd, rd oder th. Zur Verwendung mit j empfohlen.</i>",
            "w": "<ins>Numerischer Tag einer Woche</ins>\n<i>0 (für Sonntag) bis 6 (für Samstag)</i>",
            "z": "<ins>Der Tag des Jahres (von 0 beginnend)</ins>\n<i>0 bis 365</i>",
            "W": "<ins>ISO-8601 Wochennummer des Jahres, die Woche beginnt am Montag\n<i>Beispiel: 42 (die 42. Woche im Jahr)</i>",
            "F": "<ins>Monat als ganzes Wort, wie January oder March</ins>\n<i>January bis December</i>",
            "m": "<ins>Monat als Zahl, mit führenden Nullen</ins>\n<i>01 bis 12</i>",
            "M": "<ins>Monatsname mit drei Buchstaben</ins>\n<i>Jan bis Dec</i>",
            "n": "<ins>Monatszahl, ohne führende Nullen</ins>\n<i>1 bis 12</i>",
            "t": "<ins>Anzahl der Tage des angegebenen Monats</ins>\n<i>28 bis 31</i>",
            "L": "<ins>Schaltjahr oder nicht</ins>\n<i>1 für ein Schaltjahr, ansonsten 0</i>",
            "o": "<ins>Jahreszahl der Kalenderwoche gemäß ISO-8601. Dies ergibt den gleichen Wert wie Y, außer wenn die ISO-Kalenderwoche (W) zum vorhergehenden oder nächsten Jahr gehört, wobei dann jenes Jahr verwendet wird (in PHP 5.1.0 hinzugefügt).</ins>\n<i>Beispiele: 1999 oder 2003</i>",
            "Y": "<ins>Vierstellige Jahreszahl</ins>\n<i>Beispiele: 1999 oder 2003</i>",
            "y": "<ins>Jahreszahl, zweistellig</ins>\n<i>Beispiele: 99 oder 03</i>",
            "a": "<ins>Kleingeschrieben: Ante meridiem (Vormittag) und Post meridiem (Nachmittag)</ins>\n<i>am oder pm</i>",
            "A": "<ins>Großgeschrieben: Ante meridiem (Vormittag) und Post meridiem (Nachmittag)</ins>\n<i>AM oder PM</i>",
            "B": "<del>(unsupported)</del>\n<ins>Swatch-Internet-Zeit</ins>\n<i> 000 bis 999</i>",
            "g": "<ins>Stunde im 12-Stunden-Format, ohne führende Nullen</ins>\n<i>1 bis 12</i>",
            "G": "<ins>Stunde im 24-Stunden-Format, ohne führende Nullen</ins>\n<i>0 bis 23</i>",
            "h": "<ins>Stunde im 12-Stunden-Format, mit führenden Nullen</ins>\n<i>01 bis 12</i>",
            "H": "<ins>Stunde im 24-Stunden-Format, mit führenden Nullen</ins>\n<i>00 bis 23</i>",
            "i": "<ins>Minuten, mit führenden Nullen</ins>\n<i>00 bis 59</i>",
            "s": "<ins>Sekunden, mit führenden Nullen</ins>\n<i>00 bis 59</i>",
            "u": "<ins>Mikrosekunden (hinzugefügt in PHP 5.2.2). Beachten Sie, dass date() immer die Ausgabe 000000 erzeugen wird, da es einen Integer als Parameter erhält, wohingegen DateTime::format() Mikrosekunden unterstützt, wenn DateTime mit Mikrosekunden erzeugt wurde.</ins>\n<i>Beispiel: 654321</i>",
            "v": "<ins>Millisekunden (hinzugefügt in PHP 7.0.0). Es gelten die selben Anmerkungen wie für u.</ins>\n<i>Example: 654</i>",
            "e": "<del>(unsupported)</del>\n<ins>Zeitzonen-Bezeichner (hinzugefügt in PHP 5.1.0)</ins>\n<i> Beispiele: UTC, GMT, Atlantic/Azores</i>",
            "I": "<del>(unsupported)</del>\n<ins>Fällt ein Datum in die Sommerzeit</ins>\n<i> 1 bei Sommerzeit, ansonsten 0.</i>",
            "O": "<del>(unsupported)</del>\n<ins>Zeitunterschied zur Greenwich time (GMT) in Stunden</ins>\n<i> Beispiel: +0200</i>",
            "P": "<del>(unsupported)</del>\n<ins>Zeitunterschied zur Greenwich time (GMT) in Stunden mit Doppelpunkt zwischen Stunden und Minuten (hinzugefügt in PHP 5.1.3)</ins>\n<i> Beispiel: +02:00</i>",
            "T": "<del>(unsupported)</del>\n<ins>Abkürzung der Zeitzone</ins>\n<i> Beispiele: EST, MDT ...</i>",
            "Z": "<del>(unsupported)</del>\n<ins>Offset der Zeitzone in Sekunden. Der Offset für Zeitzonen westlich von UTC ist immer negativ und für Zeitzonen östlich von UTC immer positiv.</ins>\n<i> -43200 bis 50400</i>",
            "c": "<del>(unsupported)</del>\n<ins>ISO 8601 Datum (hinzugefügt in PHP 5)</ins>\n<i> 2004-02-12T15:19:21+00:00</i>",
            "r": "<del>(unsupported)</del>\n<ins>Gemäß » RFC 2822 formatiertes Datum</ins>\n<i> Beispiel: Thu, 21 Dec 2000 16:01:07 +0200</i>",
            "U": "<ins>Sekunden seit Beginn der UNIX-Epoche (January 1 1970 00:00:00 GMT)</ins>\n<i>Siehe auch time()</i>"
        };
        return "<h2>Testing date(format: string, timestamp?: number/Date)</h2><dl><dt><code>timestamp</code></dt><dd>" + date_s + "</dd></dl>" + s.split("").concat(s.toUpperCase().split("")).map(s => "<section><b><code>" + s + "</code>: " + date_module_1.date(s, date_s) + "</b> " + (desc_s[s] || "<del>(unsupported)</del>") + "</section>").join("");
    }
    document.write("<style>body{font:1em calibri;background:#eee;}code{background:#eee;border:1px solid #888;padding:0.125em 0.25em;}del{color:red;text-decoration:none;font-style:italic;}ins{text-decoration:none;}section{border:1px solid #08f;margin:0.25em;padding:0.25em;background:#fff;opacity:0.5;cursor:pointer;}section:hover{opacity:1;}ins,i{display:block;border-top:1px solid #08f;margin-top:0.25em;padding-top:0.25em;}</style>");
    document.write(test_date());
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1kYXRlLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL2RhdGUvdGVzdC1kYXRlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUVBLGlDQUErQjtJQUMvQiwrQ0FBcUM7SUFFckMsU0FBUyxTQUFTO1FBQ2hCLElBQUksTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsNEJBQTRCLENBQUM7UUFDckMsSUFBSSxNQUFNLEdBRU47WUFDRixHQUFHLEVBQUUsMkVBQTJFO1lBQ2hGLEdBQUcsRUFBRSx1RUFBdUU7WUFDNUUsR0FBRyxFQUFFLGlFQUFpRTtZQUN0RSxHQUFHLEVBQUUsbUVBQW1FO1lBQ3hFLEdBQUcsRUFBRSwySUFBMkk7WUFDaEosR0FBRyxFQUFFLDJJQUEySTtZQUNoSixHQUFHLEVBQUUsb0ZBQW9GO1lBQ3pGLEdBQUcsRUFBRSxtRUFBbUU7WUFDeEUsR0FBRyxFQUFFLGlIQUFpSDtZQUN0SCxHQUFHLEVBQUUsdUZBQXVGO1lBQzVGLEdBQUcsRUFBRSxtRUFBbUU7WUFDeEUsR0FBRyxFQUFFLCtEQUErRDtZQUNwRSxHQUFHLEVBQUUsOERBQThEO1lBQ25FLEdBQUcsRUFBRSxxRUFBcUU7WUFDMUUsR0FBRyxFQUFFLDRFQUE0RTtZQUNqRixHQUFHLEVBQUUsb1JBQW9SO1lBQ3pSLEdBQUcsRUFBRSxzRUFBc0U7WUFDM0UsR0FBRyxFQUFFLGtFQUFrRTtZQUN2RSxHQUFHLEVBQUUsMEdBQTBHO1lBQy9HLEdBQUcsRUFBRSx5R0FBeUc7WUFDOUcsR0FBRyxFQUFFLGdGQUFnRjtZQUNyRixHQUFHLEVBQUUsK0VBQStFO1lBQ3BGLEdBQUcsRUFBRSwrRUFBK0U7WUFDcEYsR0FBRyxFQUFFLGdGQUFnRjtZQUNyRixHQUFHLEVBQUUsZ0ZBQWdGO1lBQ3JGLEdBQUcsRUFBRSw0REFBNEQ7WUFDakUsR0FBRyxFQUFFLDZEQUE2RDtZQUNsRSxHQUFHLEVBQUUsbVNBQW1TO1lBQ3hTLEdBQUcsRUFBRSx1SEFBdUg7WUFDNUgsR0FBRyxFQUFFLG9JQUFvSTtZQUN6SSxHQUFHLEVBQUUsZ0hBQWdIO1lBQ3JILEdBQUcsRUFBRSxtSEFBbUg7WUFDeEgsR0FBRyxFQUFFLDRMQUE0TDtZQUNqTSxHQUFHLEVBQUUsOEZBQThGO1lBQ25HLEdBQUcsRUFBRSw4TUFBOE07WUFDbk4sR0FBRyxFQUFFLCtHQUErRztZQUNwSCxHQUFHLEVBQUUsNkhBQTZIO1lBQ2xJLEdBQUcsRUFBRSx5R0FBeUc7U0FDL0csQ0FBQztRQUNGLE9BQU8sdUdBQXVHLEdBQUcsTUFBTSxHQUFHLFlBQVksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxHQUFHLFdBQVcsR0FBRyxrQkFBSSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksMEJBQTBCLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMVUsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFLLENBQUMsK1pBQStaLENBQUMsQ0FBQTtJQUMvYSxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMifQ==