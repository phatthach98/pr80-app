import { v4 as uuid } from "uuid";

export type DishOptionWithMetadata = {
  maxSelectionCount: number;
  id: string;
  defaultOptionValues: string[];
};

export class Dish {
  public id: string;
  public name: string;
  public description: string;
  public basePrice: string;
  public options: DishOptionWithMetadata[];

  constructor(
    id: string,
    name: string,
    description: string,
    basePrice: string,
    options: DishOptionWithMetadata[] = []
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.basePrice = basePrice;
    this.options = options;
  }

  static create(
    name: string,
    description: string,
    basePrice: string,
    options: DishOptionWithMetadata[] = []
  ): Dish {
    return new Dish(uuid(), name, description, basePrice, options);
  }

  public addOption(dishOption: DishOptionWithMetadata): void {
    if (!this.hasOption(dishOption.id)) {
      this.options.push(dishOption);
    }
  }

  public removeOption(optionId: string): void {
    this.options = this.options.filter((option) => option.id !== optionId);
  }

  public hasOption(optionId: string): boolean {
    return this.options.some((option) => option.id === optionId);
  }

  public updateTotalPrice(newPrice: string): void {
    // Ensure price is stored with 2 decimal places for multi-region support
    this.basePrice = newPrice;
  }

  public updateName(newName: string): void {
    this.name = newName;
  }

  public updateDescription(newDescription: string): void {
    this.description = newDescription;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      basePrice: this.basePrice,
      options: this.options,
    };
  }
}
