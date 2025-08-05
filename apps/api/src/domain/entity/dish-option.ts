import { v4 as uuid } from "uuid";
import { SelectOption } from "../../types";

export class DishOption {
  public id: string;
  public name: string;
  public description: string;
  public options: SelectOption[];

  constructor(
    id: string,
    name: string,
    description: string,
    options: SelectOption[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.options = options;
  }

  static create(
    name: string,
    description: string,
    options: SelectOption[]
  ): DishOption {
    return new DishOption(uuid(), name, description, options);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      options: this.options,
    };
  }
}
