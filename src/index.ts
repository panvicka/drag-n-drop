// enum project state
enum ProjectStatus {
  Active,
  Finished,
}

// project type
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

//custom type for listeners
type Listener<T> = (items: T[]) => void;

class State<T> {
  // subscription pattern
  // protected - cant be accesed from outside of the class but the classses that inherits can access it
  protected listeners: Listener<T>[] = [];

  addListener(listenerFce: Listener<T>) {
    this.listeners.push(listenerFce);
  }
}

// save state of the app like it is done in React or Angular to react to changes
// Project state management class
class ProjectState extends State<Project> {
  // list of projects
  private projects: Project[] = [];
  private static instance: ProjectState;

  //make this singleton
  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    } else {
      this.instance = new ProjectState();
      return this.instance;
    }
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(newProject);

    //if something changes loop thru all listeners and execute them
    for (const listenerFn of this.listeners) {
      // slice to make a copy of the array not the original array so
      // we can edit it without breaking stuff
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

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

// componen base class
// just like in react etc, every component is a renderable object
// so we need some references to divs and render function

// make generic class beciase hostElement and element can be all kind of stuff and
// forcing all to HTMLElement will loose the type control!
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    // has reference tu stuff I would like to render
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById(templateId)!
    );

    // hold reference to where I want to render template element
    // app div
    this.hostElement = <T>document.getElementById(hostElementId)!;

    // render the HTML form right in the constructor
    // import note, get the HTML content of the first parameter
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    // insert node is document fragmentm, we need access to HTML element
    this.element = <U>importedNode.firstElementChild;

    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

//class for rendering individual Project items
// T - Target element - where do I generate my projects to? To ul list
// U - What are my generated elements? This time items in li
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  private project: Project;

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  configure() {}

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector(
      "h3"
    )!.textContent = this.project.people.toString();
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

//class for rendering project list
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + "PROJECTS";
  }

  configure() {
    //add event listener
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });

      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  private renderProjects() {
    const listEl = <HTMLUListElement>(
      document.getElementById(`${this.type}-projects-list`)!
    );
    listEl.innerHTML = "";
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projectItem);
     }
  }

  //fill empty spaces in template
}

// class for rendering input forms
class ProjectInput extends Component<HTMLDivElement, HTMLFontElement> {
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
      projectState.addProject(title, desc, people);
      console.log(title, desc, people);
    } else {
      console.log("error in input data");
    }
  }
}

const prjInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
