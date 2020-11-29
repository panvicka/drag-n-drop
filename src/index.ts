// add validation logic
interface Validatable {
  value: string | number;
  required?: boolean; // ? add an option to be undefined as value (not mandatory)
  minLenght?: number; // instead of ? we can add number | undefined as well
  maxLenght?: number;
  minValue?: number;
  maxValue?: number;
}

// get object with the Validatable structure
function validate(validateInput: Validatable) {
  let isValid = true;

  // required check is needed
  if (validateInput.required) {
    // if one of those 2 is false than the isValid will be false
    isValid = isValid && validateInput.value.toString().trim().length !== 0;
  }

  if (
    validateInput.minLenght != null &&
    typeof validateInput.value === "string"
  ) {
    isValid =
      isValid && validateInput.value.trim().length > validateInput.minLenght;
  }

  if (
    validateInput.maxLenght != null &&
    typeof validateInput.value === "string"
  ) {
    isValid =
      isValid && validateInput.value.trim().length < validateInput.maxLenght;
  }

  if (
    validateInput.minValue != null &&
    typeof validateInput.value === "number"
  ) {
    isValid = isValid && validateInput.value > validateInput.minValue;
  }

  if (
    validateInput.maxValue != null &&
    typeof validateInput.value === "number"
  ) {
    isValid = isValid && validateInput.value < validateInput.maxValue;
  }

  return isValid;
}

// auto-bind decorator
// method decorated that is automatically binding this to the correct this
function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  // store original method
  const originalMethod = descriptor.value;

  // modify property descriptor of the method
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    // add bind in the get method (called when the function is needed)
    get() {
      const boundFc = originalMethod.bind(this);
      return boundFc;
    },
  };
  return adjDescriptor;
}

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFontElement;

  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    // has reference tu stuff I would like to render
    // this time project input template
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById("project-input")!
    );

    // hold reference to where I want to render template element
    // app div
    this.hostElement = <HTMLDivElement>document.getElementById("app")!;

    // render the HTML form right in the constructor
    // import note, get the HTML content of the first parameter
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    // insert node is document fragmentm, we need access to HTML element
    this.element = <HTMLFontElement>importedNode.firstElementChild;
    this.element.id = "user-input";

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
    this.attach();
  }

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
      minValue: 1,
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
      console.log(title, desc, people);
    } else {
      console.log("error in input data");
    }
  }

  private configure() {
    //set up event listener
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
