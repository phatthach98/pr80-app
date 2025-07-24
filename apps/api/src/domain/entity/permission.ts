export class Permission {
  public readonly action: string;
  public readonly resource: string;
  public readonly field: string;

  private constructor(action: string, resource: string, field: string) {
    if (!action || !resource || !field) {
      throw new Error("Permission components cannot be empty.");
    }
    this.action = action;
    this.resource = resource;
    this.field = field;
  }

  static create(action: string, resource: string, field: string): Permission {
    return new Permission(action, resource, field);
  }

  public toString(): string {
    return [this.action, this.resource, this.field].join("_");
  }

  static fromString(permissionString: string): Permission {
    const [action, resource, field] = permissionString.split("_");
    if (!action || !resource || !field) {
      throw new Error(
        'Invalid permission string format. Expected "action_resource_field".'
      );
    }
    return new Permission(action, resource, field);
  }

  public equals(other: Permission): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return (
      this.action === other.action &&
      this.resource === other.resource &&
      this.field === other.field
    );
  }

  public findByActionAndResource(
    action: string,
    resource: string
  ): Permission | null {
    if (this.action === action && this.resource === resource) {
      return this;
    }
    return null;
  }
}
