// componen base class
// just like in react etc, every component is a renderable object
// so we need some references to divs and render function

// make generic class beciase hostElement and element can be all kind of stuff and
// forcing all to HTMLElement will loose the type control!
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
