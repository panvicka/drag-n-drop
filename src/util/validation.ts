
namespace App { 
// add validation logic
export interface Validatable {
    value: string | number;
    required?: boolean; // ? add an option to be undefined as value (not mandatory)
    minLenght?: number; // instead of ? we can add number | undefined as well
    maxLenght?: number;
    minValue?: number;
    maxValue?: number;
  }

  // get object with the Validatable structure
  export function validate(validateInput: Validatable) {
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
      isValid = isValid && validateInput.value >= validateInput.minValue;
    }

    if (
      validateInput.maxValue != null &&
      typeof validateInput.value === "number"
    ) {
      isValid = isValid && validateInput.value <= validateInput.maxValue;
    }

    return isValid;
  }


}