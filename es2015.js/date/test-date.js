"use strict";
function test_date() {
    var date_s = new Date(2018, 8 - 1);
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
    return "<h2>Testing date(format: string, timestamp?: number/Date)</h2><dl><dt><code>timestamp</code></dt><dd>" + date_s + "</dd></dl>" + s.split("").concat(s.toUpperCase().split("")).map(s => "<section><b><code>" + s + "</code>: " + date(s, date_s) + "</b> " + (desc_s[s] || "<del>(unsupported)</del>") + "</section>").join("");
}
document.write("<style>body{font:1em calibri;background:#eee;}code{background:#eee;border:1px solid #888;padding:0.125em 0.25em;}del{color:red;text-decoration:none;font-style:italic;}ins{text-decoration:none;}section{border:1px solid #08f;margin:0.25em;padding:0.25em;background:#fff;opacity:0.5;cursor:pointer;}section:hover{opacity:1;}ins,i{display:block;border-top:1px solid #08f;margin-top:0.25em;padding-top:0.25em;}</style>");
document.write(test_date());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC1kYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvZGF0ZS90ZXN0LWRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUdBLFNBQVMsU0FBUztJQUNoQixJQUFJLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ25DLElBQUksQ0FBQyxHQUFHLDRCQUE0QixDQUFDO0lBQ3JDLElBQUksTUFBTSxHQUVOO1FBQ0YsR0FBRyxFQUFFLDJFQUEyRTtRQUNoRixHQUFHLEVBQUUsdUVBQXVFO1FBQzVFLEdBQUcsRUFBRSxpRUFBaUU7UUFDdEUsR0FBRyxFQUFFLG1FQUFtRTtRQUN4RSxHQUFHLEVBQUUsMklBQTJJO1FBQ2hKLEdBQUcsRUFBRSwySUFBMkk7UUFDaEosR0FBRyxFQUFFLG9GQUFvRjtRQUN6RixHQUFHLEVBQUUsbUVBQW1FO1FBQ3hFLEdBQUcsRUFBRSxpSEFBaUg7UUFDdEgsR0FBRyxFQUFFLHVGQUF1RjtRQUM1RixHQUFHLEVBQUUsbUVBQW1FO1FBQ3hFLEdBQUcsRUFBRSwrREFBK0Q7UUFDcEUsR0FBRyxFQUFFLDhEQUE4RDtRQUNuRSxHQUFHLEVBQUUscUVBQXFFO1FBQzFFLEdBQUcsRUFBRSw0RUFBNEU7UUFDakYsR0FBRyxFQUFFLG9SQUFvUjtRQUN6UixHQUFHLEVBQUUsc0VBQXNFO1FBQzNFLEdBQUcsRUFBRSxrRUFBa0U7UUFDdkUsR0FBRyxFQUFFLDBHQUEwRztRQUMvRyxHQUFHLEVBQUUseUdBQXlHO1FBQzlHLEdBQUcsRUFBRSxnRkFBZ0Y7UUFDckYsR0FBRyxFQUFFLCtFQUErRTtRQUNwRixHQUFHLEVBQUUsK0VBQStFO1FBQ3BGLEdBQUcsRUFBRSxnRkFBZ0Y7UUFDckYsR0FBRyxFQUFFLGdGQUFnRjtRQUNyRixHQUFHLEVBQUUsNERBQTREO1FBQ2pFLEdBQUcsRUFBRSw2REFBNkQ7UUFDbEUsR0FBRyxFQUFFLG1TQUFtUztRQUN4UyxHQUFHLEVBQUUsdUhBQXVIO1FBQzVILEdBQUcsRUFBRSxvSUFBb0k7UUFDekksR0FBRyxFQUFFLGdIQUFnSDtRQUNySCxHQUFHLEVBQUUsbUhBQW1IO1FBQ3hILEdBQUcsRUFBRSw0TEFBNEw7UUFDak0sR0FBRyxFQUFFLDhGQUE4RjtRQUNuRyxHQUFHLEVBQUUsOE1BQThNO1FBQ25OLEdBQUcsRUFBRSwrR0FBK0c7UUFDcEgsR0FBRyxFQUFFLDZIQUE2SDtRQUNsSSxHQUFHLEVBQUUseUdBQXlHO0tBQy9HLENBQUM7SUFDRixPQUFPLHVHQUF1RyxHQUFHLE1BQU0sR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLG9CQUFvQixHQUFHLENBQUMsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksMEJBQTBCLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDMVUsQ0FBQztBQUVELFFBQVEsQ0FBQyxLQUFLLENBQUMsK1pBQStaLENBQUMsQ0FBQTtBQUMvYSxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMifQ==