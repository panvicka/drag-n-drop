import { ProjectInput } from "./components/project-input";
import { ProjectList } from "./components/project-list";

new ProjectInput();
new ProjectList("active");
new ProjectList("finished");



/**
 * USING 3rd party libraries in TS project
 * not related to the drag-n-drop project 
 */

// importing JS libraries with Vanilla JS build for Vanilla JS 
// we need to install @types so it works ok 
import _ from "lodash";
console.log(_.shuffle([1, 3, 4, 7]));


// what do we do if there are no types 

// global is a variblae declared in the index.html
// not visible for TS but we can declare it with "declare"
declare var GLOBAL: string;
console.log(GLOBAL);

