(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../i18n/i18n.module"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const i18n_module_1 = require("../i18n/i18n.module");
    const calendar_i18n_de = {
        "Su.": "So.",
        "Mo.": "Mo.",
        "Tu.": "Di.",
        "We.": "Mi.",
        "Th.": "Do.",
        "Fr.": "Fr.",
        "Sa.": "Sa.",
        "January": "Januar",
        "February": "Februar",
        "March": "März",
        "April": "April",
        "May": "Mai",
        "June": "Juni",
        "July": "Juli",
        "August": "August",
        "September": "September",
        "October": "Oktober",
        "November": "November",
        "December": "Dezember",
        "January $0": "Januar $0",
        "February $0": "Februar $0",
        "March $0": "März $0",
        "April $0": "April $0",
        "May $0": "Mai $0",
        "June $0": "Juni $0",
        "July $0": "Juli $0",
        "August $0": "August $0",
        "September $0": "September $0",
        "October $0": "Oktober $0",
        "November $0": "November $0",
        "December $0": "Dezember $0"
    };
    i18n_module_1.i18n.defineNamespace("mpc", calendar_i18n_de);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi1kZS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9jYWxlbmRhci9pMThuLWRlLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUVBLHFEQUEyQztJQUUzQyxNQUFNLGdCQUFnQixHQUFHO1FBQ3ZCLEtBQUssRUFBRSxLQUFLO1FBQ1osS0FBSyxFQUFFLEtBQUs7UUFDWixLQUFLLEVBQUUsS0FBSztRQUNaLEtBQUssRUFBRSxLQUFLO1FBQ1osS0FBSyxFQUFFLEtBQUs7UUFDWixLQUFLLEVBQUUsS0FBSztRQUNaLEtBQUssRUFBRSxLQUFLO1FBQ1osU0FBUyxFQUFFLFFBQVE7UUFDbkIsVUFBVSxFQUFFLFNBQVM7UUFDckIsT0FBTyxFQUFFLE1BQU07UUFDZixPQUFPLEVBQUUsT0FBTztRQUNoQixLQUFLLEVBQUUsS0FBSztRQUNaLE1BQU0sRUFBRSxNQUFNO1FBQ2QsTUFBTSxFQUFFLE1BQU07UUFDZCxRQUFRLEVBQUUsUUFBUTtRQUNsQixXQUFXLEVBQUUsV0FBVztRQUN4QixTQUFTLEVBQUUsU0FBUztRQUNwQixVQUFVLEVBQUUsVUFBVTtRQUN0QixVQUFVLEVBQUUsVUFBVTtRQUN0QixZQUFZLEVBQUUsV0FBVztRQUN6QixhQUFhLEVBQUUsWUFBWTtRQUMzQixVQUFVLEVBQUUsU0FBUztRQUNyQixVQUFVLEVBQUUsVUFBVTtRQUN0QixRQUFRLEVBQUUsUUFBUTtRQUNsQixTQUFTLEVBQUUsU0FBUztRQUNwQixTQUFTLEVBQUUsU0FBUztRQUNwQixXQUFXLEVBQUUsV0FBVztRQUN4QixjQUFjLEVBQUUsY0FBYztRQUM5QixZQUFZLEVBQUUsWUFBWTtRQUMxQixhQUFhLEVBQUUsYUFBYTtRQUM1QixhQUFhLEVBQUUsYUFBYTtLQUM3QixDQUFDO0lBRUYsa0JBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUMifQ==