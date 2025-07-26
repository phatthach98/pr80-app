// This file is used to extend the default Express Request interface.
// By doing this, we can add our custom properties like `user` to the
// request object and have them available with full type safety across the application.

declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
      roleIds: string[];
    };
  }
} 