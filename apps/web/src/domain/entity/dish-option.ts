import { DetailDishOptionsResponseWithMetadataDTO } from '@pr80-app/shared-contracts';
import { DishOptionItem } from './dish-option-item';

export class DishOption {
  private constructor(
    public id: string,
    public name: string,
    public description: string,
    public items: DishOptionItem[],
    public maxSelectionCount: number,
    public defaultOptionValues: string[],
  ) {
    // Freeze arrays and object for immutability enforcement
    Object.freeze(this.items);
    Object.freeze(this.defaultOptionValues);
    Object.freeze(this);
  }

  // ✅ Base Function 1: Response mapping
  static fromResponseDTO(dto: DetailDishOptionsResponseWithMetadataDTO): DishOption {
    const optionItems = dto.optionItems || [];
    const items = DishOptionItem.fromSelectOptionWithPriceList(optionItems);

    return new DishOption(
      dto.id,
      dto.name,
      dto.description,
      items,
      dto.maxSelectionCount,
      dto.defaultOptionValues,
    );
  }

  static fromResponseDTOList(dtos: DetailDishOptionsResponseWithMetadataDTO[]): DishOption[] {
    return dtos.map((dto) => this.fromResponseDTO(dto));
  }

  hasOption(optionValue: string): boolean {
    return this.items.some((item) => item.value === optionValue);
  }

  getOptionCount(): number {
    return this.items.length;
  }

  getOptionDisplayText(optionValue: string): string {
    const option = this._getOptionByValue(optionValue);
    if (!option) return '';
    return option.getDisplayText();
  }

  // Helper method for comparing instances
  equals(other: DishOption): boolean {
    return (
      this.id === other.id &&
      this.name === other.name &&
      this.description === other.description &&
      this.items.length === other.items.length &&
      this.items.every((item, index) => {
        return item.equals(other.items[index]);
      }) &&
      this.maxSelectionCount === other.maxSelectionCount &&
      this.defaultOptionValues.length === other.defaultOptionValues.length &&
      this.defaultOptionValues.every((value, index) => value === other.defaultOptionValues[index])
    );
  }

  private _getOptionByValue(optionValue: string): DishOptionItem | undefined {
    return this.items.find((item) => item.value === optionValue);
  }
}
