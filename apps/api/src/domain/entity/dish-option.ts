import { v4 as uuid } from "uuid";
import { SelectOptionWithPrice } from "@pr80-app/shared-contracts";

export class DishOption {
  public id: string;
  public name: string;
  public description: string;
  public optionItems: SelectOptionWithPrice[];

  constructor(
    id: string,
    name: string,
    description: string,
    optionItems: SelectOptionWithPrice[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.optionItems = optionItems;
  }

  static create(
    name: string,
    description: string,
    optionItems: SelectOptionWithPrice[]
  ): DishOption {
    return new DishOption(uuid(), name, description, optionItems);
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      optionItems: this.optionItems.length > 0 ? this.optionItems : [],
    };
  }
}
