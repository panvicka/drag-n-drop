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
    this.element.id = 'user-input';

    //grab all input elements
    this.titleInputElement = <HTMLInputElement>this.element.querySelector('#title');
    this.descriptionInputElement = <HTMLInputElement>this.element.querySelector('#description');
    this.peopleInputElement = <HTMLInputElement>this.element.querySelector('#people');



    this.configure();
    this.attach();
  }

  private submitHandler(event: Event) {
    event.preventDefault();
    console.log('submited ' + this.titleInputElement.value);
    
  }

  private configure() {
      //set up event listener
      this.element.addEventListener('submit', this.submitHandler.bind(this));
  }

  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}


const prjInput = new ProjectInput();
 