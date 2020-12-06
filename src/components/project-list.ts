import { AutoBind } from "../decorators/autobind.js";
import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js";
import { projectState } from "../state/project-state.js";
import { Component } from "./base-component.js";
import { ProjectItem } from "./project-item.js";

  //class for rendering project list
  export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget {
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

      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);
    }

    private renderProjects() {
      const listEl = <HTMLUListElement>(
        document.getElementById(`${this.type}-projects-list`)!
      );
      listEl.innerHTML = "";
      for (const projectItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
      }
    }

    @AutoBind
    dragOverHandler(event: DragEvent) {
      // first check if whatever i am holding is droppable here
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.add("droppable");
      }
    }
    @AutoBind
    dragLeaveHandler(event: DragEvent) {
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.remove("droppable");
    }

    @AutoBind
    dropHandler(event: DragEvent) {
      const projectId = event.dataTransfer!.getData("text/plain");
      projectState.moveProject(
        projectId,
        this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
      );
    }
  }

