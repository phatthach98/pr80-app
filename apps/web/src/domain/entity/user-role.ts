import { UserRoleResponseDTO } from '@pr80-app/shared-contracts';

export class UserRoleEntity {
  private constructor(
    public readonly id: string,
    public readonly name: string
  ) {
    Object.freeze(this);
  }

  static fromResponseDTO(dto: UserRoleResponseDTO): UserRoleEntity {
    return new UserRoleEntity(dto.id, dto.name);
  }

  static fromResponseDTOList(dtos: UserRoleResponseDTO[]): UserRoleEntity[] {
    return dtos.map(dto => this.fromResponseDTO(dto));
  }
}
