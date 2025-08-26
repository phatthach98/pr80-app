import { 
  UserResponseDTO, 
  CreateUserRequestDTO,
  UpdateUserRequestDTO
} from '@pr80-app/shared-contracts';
import { UserRole } from './user-role';

export class User {
  private constructor(
    public readonly id: string,
    public readonly phoneNumber: string,
    public readonly name: string,
    public readonly roles: readonly UserRole[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {
    // Freeze arrays and object for immutability enforcement
    Object.freeze(this.roles);
    Object.freeze(this);
  }

  // Public factory method for creating from API response
  static fromResponseDTO(dto: UserResponseDTO): User {
    return this.mapFromDTO(dto);
  }

  static fromResponseDTOList(dtos: UserResponseDTO[]): User[] {
    return dtos.map(dto => this.fromResponseDTO(dto));
  }

  // Private mapping logic
  private static mapFromDTO(dto: UserResponseDTO): User {
    const roles = dto.roles.map(roleDto => 
      UserRole.fromResponseDTO(roleDto)
    );

    return new User(
      dto.id,
      dto.phoneNumber,
      dto.name,
      roles,
      dto.createdAt,
      dto.updatedAt
    );
  }

  // Methods to convert domain entity to API request DTOs
  toCreateRequestDTO(passCode: string): CreateUserRequestDTO {
    return {
      name: this.name,
      phoneNumber: this.phoneNumber,
      passCode,
      roleIds: this.roles.map(role => role.id)
    };
  }

  // Selective mapping - only include changed fields
  toUpdateRequestDTO(changedFields?: Partial<Pick<User, 'name' | 'phoneNumber'>>): UpdateUserRequestDTO {
    const dto: UpdateUserRequestDTO = {};
    
    if (!changedFields || 'name' in changedFields) dto.name = this.name;
    if (!changedFields || 'phoneNumber' in changedFields) dto.phoneNumber = this.phoneNumber;
    
    // Include role IDs if needed
    dto.roleIds = this.roles.map(role => role.id);
    
    return dto;
  }

  // Immutable update methods - only create new instance if value actually changed
  withName(newName: string): User {
    if (this.name === newName) return this;
    
    return new User(
      this.id,
      this.phoneNumber,
      newName,
      this.roles,
      this.createdAt,
      this.updatedAt
    );
  }

  withPhoneNumber(newPhoneNumber: string): User {
    if (this.phoneNumber === newPhoneNumber) return this;
    
    return new User(
      this.id,
      newPhoneNumber,
      this.name,
      this.roles,
      this.createdAt,
      this.updatedAt
    );
  }

  withRoles(newRoles: readonly UserRole[]): User {
    // Check if roles actually changed by comparing IDs
    const currentRoleIds = this.roles.map(r => r.id).sort();
    const newRoleIds = newRoles.map(r => r.id).sort();
    
    if (currentRoleIds.length === newRoleIds.length && 
        currentRoleIds.every((id, index) => id === newRoleIds[index])) {
      return this; // No change
    }
    
    return new User(
      this.id,
      this.phoneNumber,
      this.name,
      newRoles,
      this.createdAt,
      this.updatedAt
    );
  }

  // Efficient bulk update method
  withChanges(changes: Partial<Pick<User, 'name' | 'phoneNumber'>>): User {
    // Check if any values actually changed
    const hasChanges = Object.entries(changes).some(([key, value]) => 
      this[key as keyof typeof changes] !== value
    );
    
    if (!hasChanges) return this;
    
    return new User(
      this.id,
      changes.phoneNumber ?? this.phoneNumber,
      changes.name ?? this.name,
      this.roles,
      this.createdAt,
      this.updatedAt
    );
  }
}
