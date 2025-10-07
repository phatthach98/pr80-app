import { EErrorCode } from '@pr80-app/shared-contracts';

/**
 * Maps error codes to user-friendly messages for the frontend
 */
export const ErrorMessageMapper: Record<EErrorCode, string> = {
  // Authentication & Authorization Errors
  [EErrorCode.UNAUTHORIZED]: 'Authentication required. Please log in again.',
  [EErrorCode.FORBIDDEN]: 'You do not have permission to perform this action.',
  [EErrorCode.INVALID_CREDENTIALS]: 'Invalid phone number or passcode. Please try again.',
  [EErrorCode.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [EErrorCode.TOKEN_INVALID]: 'Invalid authentication token. Please log in again.',
  [EErrorCode.INSUFFICIENT_PERMISSIONS]: 'You do not have sufficient permissions for this action.',

  // Validation Errors
  [EErrorCode.VALIDATION_ERROR]: 'Please check your input and try again.',
  [EErrorCode.INVALID_INPUT]: 'The provided input is invalid. Please correct it and try again.',
  [EErrorCode.MISSING_REQUIRED_FIELD]: 'Please fill in all required fields.',
  [EErrorCode.INVALID_FORMAT]: 'The format of the provided data is incorrect.',

  // Resource Errors
  [EErrorCode.NOT_FOUND]: 'The requested item could not be found.',
  [EErrorCode.ALREADY_EXISTS]: 'This item already exists. Please use a different value.',
  [EErrorCode.CONFLICT]: 'There was a conflict with your request. Please try again.',
  [EErrorCode.RESOURCE_EXHAUSTED]: 'The resource limit has been reached. Please try again later.',

  // Business Logic Errors
  [EErrorCode.BUSINESS_RULE_VIOLATION]:
    'This action violates business rules and cannot be completed.',
  [EErrorCode.INVALID_STATE]: 'The current state does not allow this operation.',
  [EErrorCode.OPERATION_NOT_ALLOWED]: 'This operation is not allowed at this time.',

  // External Service Errors
  [EErrorCode.EXTERNAL_SERVICE_ERROR]:
    'An external service error occurred. Please try again later.',
  [EErrorCode.EXTERNAL_SERVICE_TIMEOUT]: 'External service timed out. Please try again later.',
  [EErrorCode.EXTERNAL_SERVICE_UNAVAILABLE]:
    'External service is currently unavailable. Please try again later.',

  // Database Errors
  [EErrorCode.DATABASE_ERROR]: 'A database error occurred. Please try again later.',
  [EErrorCode.QUERY_FAILED]: 'Database query failed. Please try again later.',
  [EErrorCode.TRANSACTION_FAILED]: 'Transaction failed. Please try again.',
  [EErrorCode.UNIQUE_CONSTRAINT_VIOLATION]:
    'This value must be unique. Please use a different value.',
  [EErrorCode.FOREIGN_KEY_CONSTRAINT_VIOLATION]:
    'Cannot complete this action due to related data constraints.',

  // System Errors
  [EErrorCode.INTERNAL_SERVER_ERROR]: 'An internal server error occurred. Please try again later.',
  [EErrorCode.NOT_IMPLEMENTED]: 'This feature is not yet implemented.',
  [EErrorCode.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable. Please try again later.',
  [EErrorCode.TIMEOUT]: 'The request timed out. Please try again.',
  [EErrorCode.BAD_REQUEST]: 'Bad request. Please check your input and try again.',
  [EErrorCode.BAD_GATEWAY]: 'Bad gateway. The server is temporarily unavailable.',
  [EErrorCode.GATEWAY_TIMEOUT]: 'Gateway timeout. The server took too long to respond.',
  [EErrorCode.SERVER_ERROR]: 'Server error. Please try again later.',

  // Network & Connection Errors
  [EErrorCode.NETWORK_ERROR]: 'Network error. Please check your internet connection and try again.',
  [EErrorCode.CONNECTION_ERROR]:
    'Unable to connect to the server. Please check your internet connection and try again.',
  [EErrorCode.REQUEST_TIMEOUT]: 'Request timed out. Please try again.',
  [EErrorCode.REQUEST_CANCELED]: 'Request was cancelled.',
  [EErrorCode.REQUEST_CONFIG_ERROR]: 'Request configuration error. Please try again.',
  [EErrorCode.UNEXPECTED_ERROR]: 'An unexpected error occurred. Please try again.',

  // File Errors
  [EErrorCode.FILE_TOO_LARGE]: 'The file is too large. Please choose a smaller file.',
  [EErrorCode.INVALID_FILE_TYPE]: 'Invalid file type. Please choose a supported file format.',
  [EErrorCode.FILE_UPLOAD_FAILED]: 'File upload failed. Please try again.',

  // Order-specific Errors
  [EErrorCode.ORDER_ALREADY_PROCESSED]:
    'This order has already been processed and cannot be modified.',
  [EErrorCode.ORDER_ITEM_NOT_AVAILABLE]: 'One or more items in your order are no longer available.',
  [EErrorCode.ORDER_CANNOT_BE_MODIFIED]: 'This order cannot be modified at this time.',

  // User-specific Errors
  [EErrorCode.USER_NOT_ACTIVE]: 'Your account is not active. Please contact an administrator.',
  [EErrorCode.USER_ALREADY_EXISTS]: 'A user with this information already exists.',

  // Payment Errors
  [EErrorCode.PAYMENT_FAILED]:
    'Payment failed. Please try again or use a different payment method.',
  [EErrorCode.PAYMENT_METHOD_INVALID]:
    'The payment method is invalid. Please use a different payment method.',
  [EErrorCode.INSUFFICIENT_FUNDS]:
    'Insufficient funds. Please check your balance or use a different payment method.',

  // Rate Limiting Errors
  [EErrorCode.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded. Please wait before trying again.',
  [EErrorCode.TOO_MANY_REQUESTS]: 'Too many requests. Please wait a moment before trying again.',
};

/**
 * Gets a user-friendly error message for the given error code
 * @param errorCode - The error code from the API response
 * @param fallbackMessage - Optional fallback message if error code is not found
 * @returns User-friendly error message
 */
export function getErrorMessage(errorCode: string, fallbackMessage?: string): string {
  const message = ErrorMessageMapper[errorCode as EErrorCode];
  return message || fallbackMessage || 'An unexpected error occurred. Please try again.';
}

/**
 * Checks if an error code is a validation error
 * @param errorCode - The error code to check
 * @returns True if the error code represents a validation error
 */
export function isValidationError(errorCode: string): boolean {
  const validationErrors = [
    EErrorCode.VALIDATION_ERROR,
    EErrorCode.INVALID_INPUT,
    EErrorCode.MISSING_REQUIRED_FIELD,
    EErrorCode.INVALID_FORMAT,
  ];
  return validationErrors.includes(errorCode as EErrorCode);
}

/**
 * Checks if an error code is an authentication error
 * @param errorCode - The error code to check
 * @returns True if the error code represents an authentication error
 */
export function isAuthenticationError(errorCode: string): boolean {
  const authErrors = [
    EErrorCode.UNAUTHORIZED,
    EErrorCode.FORBIDDEN,
    EErrorCode.INVALID_CREDENTIALS,
    EErrorCode.TOKEN_EXPIRED,
    EErrorCode.TOKEN_INVALID,
    EErrorCode.INSUFFICIENT_PERMISSIONS,
  ];
  return authErrors.includes(errorCode as EErrorCode);
}

/**
 * Checks if an error code represents a temporary/retryable error
 * @param errorCode - The error code to check
 * @returns True if the error might be resolved by retrying
 */
export function isRetryableError(errorCode: string): boolean {
  const retryableErrors = [
    EErrorCode.EXTERNAL_SERVICE_TIMEOUT,
    EErrorCode.EXTERNAL_SERVICE_UNAVAILABLE,
    EErrorCode.SERVICE_UNAVAILABLE,
    EErrorCode.TIMEOUT,
    EErrorCode.RATE_LIMIT_EXCEEDED,
    EErrorCode.TOO_MANY_REQUESTS,
    EErrorCode.NETWORK_ERROR,
    EErrorCode.CONNECTION_ERROR,
    EErrorCode.REQUEST_TIMEOUT,
    EErrorCode.BAD_GATEWAY,
    EErrorCode.GATEWAY_TIMEOUT,
  ];
  return retryableErrors.includes(errorCode as EErrorCode);
}
