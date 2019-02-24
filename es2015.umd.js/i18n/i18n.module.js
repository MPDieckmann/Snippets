(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function i18n(text, namespace = "", ...args) {
        if (namespace in i18n._namespaces && text in i18n._namespaces[namespace]) {
            text = i18n._namespaces[namespace][text];
        }
        args.forEach((arg, index) => {
            text = text.replace(new RegExp("\\$" + index, "g"), arg);
        });
        return text;
    }
    exports.i18n = i18n;
    (function (i18n) {
        i18n._namespaces = Object.create(null);
        function defineNamespace(namespace, translations) {
            if (namespace == "") {
                throw "Namespace cannot be declared";
            }
            i18n._namespaces[namespace] = i18n._namespaces[namespace] || {};
            Object.assign(i18n._namespaces[namespace], translations);
        }
        i18n.defineNamespace = defineNamespace;
        function opt(value, opt0, opt1, optN, namespace = "") {
            var text = optN;
            if (value == 0) {
                text = opt0;
            }
            else if (value == 1) {
                text = opt1;
            }
            return i18n(text, namespace, value.toString());
        }
        i18n.opt = opt;
    })(i18n = exports.i18n || (exports.i18n = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90cy9pMThuL2kxOG4ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBU0EsU0FBZ0IsSUFBSSxDQUFDLElBQVksRUFBRSxZQUFvQixFQUFFLEVBQUUsR0FBRyxJQUFjO1FBQzFFLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDeEUsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUM7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQzFCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFSRCxvQkFRQztJQUVELFdBQWlCLElBQUk7UUFLTixnQkFBVyxHQU1wQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBT3hCLFNBQWdCLGVBQWUsQ0FBQyxTQUFpQixFQUFFLFlBQXNDO1lBQ3ZGLElBQUksU0FBUyxJQUFJLEVBQUUsRUFBRTtnQkFDbkIsTUFBTSw4QkFBOEIsQ0FBQzthQUN0QztZQUNELEtBQUEsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUEsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN0RCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUEsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFOZSxvQkFBZSxrQkFNOUIsQ0FBQTtRQVVELFNBQWdCLEdBQUcsQ0FBQyxLQUFhLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxJQUFZLEVBQUUsWUFBb0IsRUFBRTtZQUNqRyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7WUFDaEIsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO2dCQUNkLElBQUksR0FBRyxJQUFJLENBQUM7YUFDYjtpQkFBTSxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7Z0JBQ3JCLElBQUksR0FBRyxJQUFJLENBQUM7YUFDYjtZQUNELE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDakQsQ0FBQztRQVJlLFFBQUcsTUFRbEIsQ0FBQTtJQUNILENBQUMsRUEzQ2dCLElBQUksR0FBSixZQUFJLEtBQUosWUFBSSxRQTJDcEIifQ==