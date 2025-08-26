import { ErrorCode } from '@pr80-app/shared-contracts';

/**
 * Maps error codes to user-friendly messages for the frontend
 */
export const ErrorMessageMapper: Record<ErrorCode, string> = {
  // Authentication & Authorization Errors
  [ErrorCode.UNAUTHORIZED]: 'Authentication required. Please log in again.',
  [ErrorCode.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ErrorCode.INVALID_CREDENTIALS]: 'Invalid phone number or passcode. Please try again.',
  [ErrorCode.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [ErrorCode.TOKEN_INVALID]: 'Invalid authentication token. Please log in again.',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'You do not have sufficient permissions for this action.',
  
  // Validation Errors
  [ErrorCode.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ErrorCode.INVALID_INPUT]: 'The provided input is invalid. Please correct it and try again.',
  [ErrorCode.MISSING_REQUIRED_FIELD]: 'Please fill in all required fields.',
  [ErrorCode.INVALID_FORMAT]: 'The format of the provided data is incorrect.',
  
  // Resource Errors
  [ErrorCode.NOT_FOUND]: 'The requested item could not be found.',
  [ErrorCode.ALREADY_EXISTS]: 'This item already exists. Please use a different value.',
  [ErrorCode.CONFLICT]: 'There was a conflict with your request. Please try again.',
  [ErrorCode.RESOURCE_EXHAUSTED]: 'The resource limit has been reached. Please try again later.',
  
  // Business Logic Errors
  [ErrorCode.BUSINESS_RULE_VIOLATION]: 'This action violates business rules and cannot be completed.',
  [ErrorCode.INVALID_STATE]: 'The current state does not allow this operation.',
  [ErrorCode.OPERATION_NOT_ALLOWED]: 'This operation is not allowed at this time.',
  
  // External Service Errors
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'An external service error occurred. Please try again later.',
  [ErrorCode.EXTERNAL_SERVICE_TIMEOUT]: 'External service timed out. Please try again later.',
  [ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE]: 'External service is currently unavailable. Please try again later.',
  
  // Database Errors
  [ErrorCode.DATABASE_ERROR]: 'A database error occurred. Please try again later.',
  [ErrorCode.QUERY_FAILED]: 'Database query failed. Please try again later.',
  [ErrorCode.TRANSACTION_FAILED]: 'Transaction failed. Please try again.',
  [ErrorCode.UNIQUE_CONSTRAINT_VIOLATION]: 'This value must be unique. Please use a different value.',
  [ErrorCode.FOREIGN_KEY_CONSTRAINT_VIOLATION]: 'Cannot complete this action due to related data constraints.',
  
  // System Errors
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'An internal server error occurred. Please try again later.',
  [ErrorCode.NOT_IMPLEMENTED]: 'This feature is not yet implemented.',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable. Please try again later.',
  [ErrorCode.TIMEOUT]: 'The request timed out. Please try again.',
  
  // File Errors
  [ErrorCode.FILE_TOO_LARGE]: 'The file is too large. Please choose a smaller file.',
  [ErrorCode.INVALID_FILE_TYPE]: 'Invalid file type. Please choose a supported file format.',
  [ErrorCode.FILE_UPLOAD_FAILED]: 'File upload failed. Please try again.',
  
  // Order-specific Errors
  [ErrorCode.ORDER_ALREADY_PROCESSED]: 'This order has already been processed and cannot be modified.',
  [ErrorCode.ORDER_ITEM_NOT_AVAILABLE]: 'One or more items in your order are no longer available.',
  [ErrorCode.ORDER_CANNOT_BE_MODIFIED]: 'This order cannot be modified at this time.',
  
  // User-specific Errors
  [ErrorCode.USER_NOT_ACTIVE]: 'Your account is not active. Please contact an administrator.',
  [ErrorCode.USER_ALREADY_EXISTS]: 'A user with this information already exists.',
  
  // Payment Errors
  [ErrorCode.PAYMENT_FAILED]: 'Payment failed. Please try again or use a different payment method.',
  [ErrorCode.PAYMENT_METHOD_INVALID]: 'The payment method is invalid. Please use a different payment method.',
  [ErrorCode.INSUFFICIENT_FUNDS]: 'Insufficient funds. Please check your balance or use a different payment method.',
  
  // Rate Limiting Errors
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded. Please wait before trying again.',
  [ErrorCode.TOO_MANY_REQUESTS]: 'Too many requests. Please wait a moment before trying again.',
};

/**
 * Gets a user-friendly error message for the given error code
 * @param errorCode - The error code from the API response
 * @param fallbackMessage - Optional fallback message if error code is not found
 * @returns User-friendly error message
 */
export function getErrorMessage(errorCode: string, fallbackMessage?: string): string {
  const message = ErrorMessageMapper[errorCode as ErrorCode];
  return message || fallbackMessage || 'An unexpected error occurred. Please try again.';
}

/**
 * Checks if an error code is a validation error
 * @param errorCode - The error code to check
 * @returns True if the error code represents a validation error
 */
export function isValidationError(errorCode: string): boolean {
  const validationErrors = [
    ErrorCode.VALIDATION_ERROR,
    ErrorCode.INVALID_INPUT,
    ErrorCode.MISSING_REQUIRED_FIELD,
    ErrorCode.INVALID_FORMAT,
  ];
  return validationErrors.includes(errorCode as ErrorCode);
}

/**
 * Checks if an error code is an authentication error
 * @param errorCode - The error code to check
 * @returns True if the error code represents an authentication error
 */
export function isAuthenticationError(errorCode: string): boolean {
  const authErrors = [
    ErrorCode.UNAUTHORIZED,
    ErrorCode.FORBIDDEN,
    ErrorCode.INVALID_CREDENTIALS,
    ErrorCode.TOKEN_EXPIRED,
    ErrorCode.TOKEN_INVALID,
    ErrorCode.INSUFFICIENT_PERMISSIONS,
  ];
  return authErrors.includes(errorCode as ErrorCode);
}

/**
 * Checks if an error code represents a temporary/retryable error
 * @param errorCode - The error code to check
 * @returns True if the error might be resolved by retrying
 */
export function isRetryableError(errorCode: string): boolean {
  const retryableErrors = [
    ErrorCode.EXTERNAL_SERVICE_TIMEOUT,
    ErrorCode.EXTERNAL_SERVICE_UNAVAILABLE,
    ErrorCode.SERVICE_UNAVAILABLE,
    ErrorCode.TIMEOUT,
    ErrorCode.RATE_LIMIT_EXCEEDED,
    ErrorCode.TOO_MANY_REQUESTS,
  ];
  return retryableErrors.includes(errorCode as ErrorCode);
}
