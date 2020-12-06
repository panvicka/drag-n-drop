namespace App {
  // auto-bind decorator
  // method decorated that is automatically binding this to the correct this
  export function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
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
}
