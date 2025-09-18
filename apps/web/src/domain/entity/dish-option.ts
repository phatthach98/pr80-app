import { DishOptionResponseDTO } from '@pr80-app/shared-contracts';
import { DishOptionItem } from './dish-option-item';

export class DishOption {
  private constructor(
    public id: string,
    public name: string,
    public description: string,
    public items: DishOptionItem[],
    public isAllowMultipleSelection: boolean,
    public maxSelectionCount: number,
  ) {
    // Freeze arrays and object for immutability enforcement
    Object.freeze(this.items);
    Object.freeze(this);
  }

  // ✅ Base Function 1: Response mapping
  static fromResponseDTO(dto: DishOptionResponseDTO): DishOption {
    const optionItems = dto.optionItems || [];
    const items = DishOptionItem.fromSelectOptionWithPriceList(optionItems);

    return new DishOption(
      dto.id,
      dto.name,
      dto.description,
      items,
      dto.isAllowMultipleSelection,
      dto.maxSelectionCount,
    );
  }

  static fromResponseDTOList(dtos: DishOptionResponseDTO[]): DishOption[] {
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
      this.maxSelectionCount === other.maxSelectionCount
    );
  }

  private _getOptionByValue(optionValue: string): DishOptionItem | undefined {
    return this.items.find((item) => item.value === optionValue);
  }
}
