import { Project, ProjectStatus } from "../models/project.js";

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
export class ProjectState extends State<Project> {
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
    this.updateListener();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const projectToChange = this.projects.find(
      (project) => project.id === projectId
    );
    // check if project exists and if the status has changes so we do not rerender
    // the page if the project was not moved
    if (projectToChange && projectToChange.status !== newStatus) {
      projectToChange.status = newStatus;
      this.updateListener();
    }
  }

  private updateListener() {
    //if something changes loop thru all listeners and execute them
    for (const listenerFn of this.listeners) {
      // slice to make a copy of the array not the original array so
      // we can edit it without breaking stuff
      listenerFn(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();
