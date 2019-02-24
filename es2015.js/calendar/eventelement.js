"use strict";
class MPCCalendarEventElement extends HTMLElement {
    constructor() {
        super();
    }
    get text() {
        return this.getAttribute("text") || "";
    }
    set text(value) {
        this.setAttribute("text", value);
    }
    get outline() {
        return this.getAttribute("outline") == "true";
    }
    set outline(value) {
        if (value) {
            this.setAttribute("outline", "true");
        }
        else {
            this.removeAttribute("outline");
        }
    }
    get color() {
        return this.getAttribute("color") || "";
    }
    set color(value) {
        this.setAttribute("color", value);
    }
    get begin() {
        return this.getAttribute("begin") || "";
    }
    set begin(value) {
        this.setAttribute("begin", value);
    }
    get end() {
        return this.getAttribute("end") || "";
    }
    set end(value) {
        this.setAttribute("end", value);
    }
    connectedCallback() {
        console.log('MPCCalendarEvent element connected to page.');
        if (this.parentElement instanceof MPCCalendarMonthElement || this.parentElement instanceof MPCCalendarDaysElement) {
            this.parentElement.updateCalendar();
        }
    }
    disconnectedCallback() {
        console.log('MPCCalendarEvent element disconnected from page.');
        if (this.parentElement instanceof MPCCalendarMonthElement || this.parentElement instanceof MPCCalendarDaysElement) {
            this.parentElement.updateCalendar();
        }
    }
    adoptedCallback() {
        console.log('MPCCalendarEvent element adopted to new page.');
        if (this.parentElement instanceof MPCCalendarMonthElement || this.parentElement instanceof MPCCalendarDaysElement) {
            this.parentElement.updateCalendar();
        }
    }
    static get observedAttributes() {
        return ['text', 'outline', 'color', "begin", "end"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        var parsed_newValue = parseInt(newValue);
        switch (name) {
            case "text":
                break;
            case "outline":
                break;
            case "color":
                break;
            case "begin":
                break;
            case "end":
                break;
        }
    }
}
customElements.define("mpc-calendar-event", MPCCalendarEventElement);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRlbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdHMvY2FsZW5kYXIvZXZlbnRlbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFJQSxNQUFNLHVCQUF3QixTQUFRLFdBQVc7SUFDL0M7UUFDRSxLQUFLLEVBQUUsQ0FBQztJQUVWLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDTixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFDRCxJQUFJLElBQUksQ0FBQyxLQUFhO1FBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksTUFBTSxDQUFDO0lBQ2hELENBQUM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFjO1FBQ3hCLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDdEM7YUFBTTtZQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsSUFBSSxLQUFLLENBQUMsS0FBYTtRQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsSUFBSSxLQUFLLENBQUMsS0FBYTtRQUNyQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsSUFBSSxHQUFHO1FBQ0wsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBYTtRQUNuQixJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1FBQzNELElBQUksSUFBSSxDQUFDLGFBQWEsWUFBWSx1QkFBdUIsSUFBSSxJQUFJLENBQUMsYUFBYSxZQUFZLHNCQUFzQixFQUFFO1lBQ2pILElBQUksQ0FBQyxhQUFhLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQsb0JBQW9CO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0RBQWtELENBQUMsQ0FBQztRQUNoRSxJQUFJLElBQUksQ0FBQyxhQUFhLFlBQVksdUJBQXVCLElBQUksSUFBSSxDQUFDLGFBQWEsWUFBWSxzQkFBc0IsRUFBRTtZQUNqSCxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVELGVBQWU7UUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLCtDQUErQyxDQUFDLENBQUM7UUFDN0QsSUFBSSxJQUFJLENBQUMsYUFBYSxZQUFZLHVCQUF1QixJQUFJLElBQUksQ0FBQyxhQUFhLFlBQVksc0JBQXNCLEVBQUU7WUFDakgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFRCxNQUFNLEtBQUssa0JBQWtCO1FBQzNCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELHdCQUF3QixDQUFDLElBQVksRUFBRSxRQUFnQixFQUFFLFFBQWdCO1FBQ3ZFLElBQUksZUFBZSxHQUFXLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxRQUFRLElBQUksRUFBRTtZQUNaLEtBQUssTUFBTTtnQkFDVCxNQUFNO1lBQ1IsS0FBSyxTQUFTO2dCQUNaLE1BQU07WUFDUixLQUFLLE9BQU87Z0JBQ1YsTUFBTTtZQUNSLEtBQUssT0FBTztnQkFDVixNQUFNO1lBQ1IsS0FBSyxLQUFLO2dCQUNSLE1BQU07U0FDVDtJQUNILENBQUM7Q0FDRjtBQUVELGNBQWMsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyJ9