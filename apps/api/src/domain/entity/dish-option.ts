import { v4 as uuid } from "uuid";
import { SelectOptionWithPrice } from "@pr80-app/shared-contracts";

export class DishOption {
  public id: string;
  public name: string;
  public isAllowMultipleSelection: boolean;
  public description: string;
  public optionItems: SelectOptionWithPrice[];

  constructor(
    id: string,
    name: string,
    description: string,
    optionItems: SelectOptionWithPrice[],
    isAllowMultipleSelection: boolean
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.optionItems = optionItems;
    this.isAllowMultipleSelection = isAllowMultipleSelection;
  }

  static create(
    name: string,
    description: string,
    optionItems: SelectOptionWithPrice[],
    isAllowMultipleSelection: boolean
  ): DishOption {
    return new DishOption(
      uuid(),
      name,
      description,
      optionItems,
      isAllowMultipleSelection
    );
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      optionItems: this.optionItems.length > 0 ? this.optionItems : [],
      isAllowMultipleSelection: this.isAllowMultipleSelection,
    };
  }
}
