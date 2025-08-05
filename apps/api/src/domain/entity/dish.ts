import { v4 as uuid } from "uuid";

export class Dish {
  public id: string;
  public name: string;
  public description: string;
  public price: number;
  public options: { id: string }[];

  constructor(
    id: string,
    name: string,
    description: string,
    price: number,
    options: { id: string }[] = []
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = parseFloat(price.toFixed(2));
    this.options = options;
  }

  static create(
    name: string,
    description: string,
    price: number,
    options: { id: string }[] = []
  ): Dish {
    return new Dish(uuid(), name, description, price, options);
  }

  public addOption(optionId: string): void {
    if (!this.hasOption(optionId)) {
      this.options.push({ id: optionId });
    }
  }

  public removeOption(optionId: string): void {
    this.options = this.options.filter(option => option.id !== optionId);
  }

  public hasOption(optionId: string): boolean {
    return this.options.some(option => option.id === optionId);
  }

  public updatePrice(newPrice: number): void {
    // Ensure price is stored with 2 decimal places for multi-region support
    this.price = parseFloat(newPrice.toFixed(2));
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
      price: this.price,
      options: this.options,
    };
  }
}