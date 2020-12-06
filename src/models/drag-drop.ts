// drag-n-drop interfaces

// for items that can be dragged
export interface Draggable {
  // "export" exports the feature out of the namespace
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

// for elements at which something can be dropped to
export interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}
