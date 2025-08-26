import { UserRoleResponseDTO } from '@pr80-app/shared-contracts';

export class UserRole {
  private constructor(
    public readonly id: string,
    public readonly name: string
  ) {
    Object.freeze(this);
  }

  static fromResponseDTO(dto: UserRoleResponseDTO): UserRole {
    return new UserRole(dto.id, dto.name);
  }

  static fromResponseDTOList(dtos: UserRoleResponseDTO[]): UserRole[] {
    return dtos.map(dto => this.fromResponseDTO(dto));
  }
}
