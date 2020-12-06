import { Component } from "./base-component";
import { AutoBind } from "../decorators/autobind";
import { Draggable } from "../models/drag-drop";
import { Project } from "../models/project";

//class for rendering individual Project items
// T - Target element - where do I generate my projects to? To ul list
// U - What are my generated elements? This time items in li
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  private project: Project;

  get persons() {
    if (this.project.people == 1) { 
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }

  //forced by the droggable interafce
  @AutoBind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);

    // this sets how the cursor will look like
    // also tells the browser that we want to move stuff (will be removed from original place)
    // alternative would be copy
    event.dataTransfer!.effectAllowed = "move";

    console.log(event);
  }

  dragEndHandler(_: DragEvent) {
    console.log("dragend");
  }
}
