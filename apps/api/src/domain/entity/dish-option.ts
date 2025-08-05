import { v4 as uuid } from "uuid";
import { DishSelectOption } from "../../types";

export class DishOption {
  public id: string;
  public name: string;
  public description: string;
  public options: DishSelectOption[];

  constructor(
    id: string,
    name: string,
    description: string,
    options: DishSelectOption[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.options = options;
  }

  static create(
    name: string,
    description: string,
    options: DishSelectOption[]
  ): DishOption {
    return new DishOption(uuid(), name, description, options);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      options: this.options.map((option) => {
        // Format extraPrice as a string with 2 decimal places
        // MongoDB Decimal128 values are always returned as objects with toString method
        const extraPrice = parseFloat(option.extraPrice.toString()).toFixed(2)
          
        return { 
          label: option.label, 
          value: option.value,
          extraPrice: extraPrice 
        };
      }),
    };
  }
}
