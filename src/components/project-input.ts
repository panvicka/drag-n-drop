/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {

// class for rendering input forms
export class ProjectInput extends Component<HTMLDivElement, HTMLFontElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
      super("project-input", "app", true, "user-input");

      //grab all input elements
      this.titleInputElement = <HTMLInputElement>(
        this.element.querySelector("#title")
      );
      this.descriptionInputElement = <HTMLInputElement>(
        this.element.querySelector("#description")
      );
      this.peopleInputElement = <HTMLInputElement>(
        this.element.querySelector("#people")
      );

      this.configure();
    }

    configure() {
      //set up event listener
      this.element.addEventListener("submit", this.submitHandler);
    }

    renderContent() {}

    private cleanInputs() {
      this.titleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.peopleInputElement.value = "";
    }

    private gatheruserInput(): [string, string, number] | void {
      const enteredTitle = this.titleInputElement.value;
      const enteredDesc = this.descriptionInputElement.value;
      const enteredPeople = this.peopleInputElement.value;

      const titleValidatable: Validatable = {
        value: enteredTitle,
        required: true,
      };

      const descValidatable: Validatable = {
        value: enteredDesc,
        required: true,
        minLenght: 5,
      };

      const peopleValidatable: Validatable = {
        value: +enteredPeople,
        required: true,
        minValue: 0,
        maxValue: 5,
      };

      if (
        !validate(titleValidatable) ||
        !validate(descValidatable) ||
        !validate(peopleValidatable)
      ) {
        alert("Invalid input");
        return;
      } else {
        this.cleanInputs();
        return [enteredTitle, enteredDesc, +enteredPeople];
      }
    }

    @AutoBind
    private submitHandler(event: Event) {
      event.preventDefault();
      const userInput = this.gatheruserInput();
      // runtime vanilla JS check if userInput is tuple (array in vanila JS)
      if (Array.isArray(userInput)) {
        const [title, desc, people] = userInput;
        projectState.addProject(title, desc, people);
        console.log(title, desc, people);
      } else {
        console.log("error in input data");
      }
    }
  }

}