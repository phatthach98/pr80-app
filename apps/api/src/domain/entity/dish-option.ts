import { v4 as uuid } from "uuid";
import { SelectOptionWithPrice } from "@pr80-app/shared-contracts";

export class DishOption {
  public id: string;
  public name: string;
  public description: string;
  public options: SelectOptionWithPrice[];

  constructor(
    id: string,
    name: string,
    description: string,
    options: SelectOptionWithPrice[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.options = options;
  }

  static create(
    name: string,
    description: string,
    options: SelectOptionWithPrice[]
  ): DishOption {
    return new DishOption(uuid(), name, description, options);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      options: this.options.length > 0 ? this.options : [],
    };
  }
}
