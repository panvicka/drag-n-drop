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

    if (
      enteredTitle.trim().length === 0 ||
      enteredDesc.trim().length === 0 ||
      enteredPeople.trim().length === 0
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
