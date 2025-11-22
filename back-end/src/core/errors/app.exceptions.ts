/**
 * Custom Application Exceptions
 *
 * Standardized error handling across the application.
 * All errors should extend AppException for consistent handling.
 */

export enum ErrorCode {
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Authentication/Authorization errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',

  // Event errors
  EVENT_NOT_FOUND = 'EVENT_NOT_FOUND',
  EVENT_ALREADY_EXISTS = 'EVENT_ALREADY_EXISTS',
  EVENT_CREATION_FAILED = 'EVENT_CREATION_FAILED',

  // Attendance errors
  ATTENDANCE_NOT_FOUND = 'ATTENDANCE_NOT_FOUND',
  ATTENDANCE_ALREADY_REGISTERED = 'ATTENDANCE_ALREADY_REGISTERED',
  ATTENDANCE_REGISTRATION_FAILED = 'ATTENDANCE_REGISTRATION_FAILED',
  INSUFFICIENT_XLM = 'INSUFFICIENT_XLM',

  // Badge errors
  BADGE_MINT_FAILED = 'BADGE_MINT_FAILED',
  BADGE_NOT_FOUND = 'BADGE_NOT_FOUND',
  BADGE_ALREADY_MINTED = 'BADGE_ALREADY_MINTED',

  // Stellar errors
  STELLAR_TRANSACTION_FAILED = 'STELLAR_TRANSACTION_FAILED',
  STELLAR_CONNECTION_ERROR = 'STELLAR_CONNECTION_ERROR',
  INVALID_STELLAR_ADDRESS = 'INVALID_STELLAR_ADDRESS',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',

  // Database errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',

  // External service errors
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',

  // System errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
}

export interface ErrorContext {
  code: ErrorCode;
  message: string;
  statusCode: number;
  context?: string;
  metadata?: Record<string, unknown>;
  originalError?: Error;
}

/**
 * Base application exception
 */
export class AppException extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly context?: string;
  readonly metadata?: Record<string, unknown>;
  readonly originalError?: Error;

  constructor(errorContext: ErrorContext) {
    super(errorContext.message);
    this.code = errorContext.code;
    this.statusCode = errorContext.statusCode;
    this.context = errorContext.context;
    this.metadata = errorContext.metadata;
    this.originalError = errorContext.originalError;

    // Maintain prototype chain
    Object.setPrototypeOf(this, AppException.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      metadata: this.metadata,
    };
  }
}

// ============================================================================
// SPECIFIC EXCEPTIONS
// ============================================================================

/**
 * Validation error
 */
export class ValidationException extends AppException {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super({
      code: ErrorCode.VALIDATION_ERROR,
      message,
      statusCode: 400,
      metadata,
    });
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}

/**
 * Event-related error
 */
export class EventException extends AppException {
  constructor(
    code: ErrorCode,
    message: string,
    metadata?: Record<string, unknown>,
    originalError?: Error
  ) {
    super({
      code,
      message,
      statusCode: 400,
      metadata,
      originalError,
    });
    Object.setPrototypeOf(this, EventException.prototype);
  }
}

/**
 * Attendance-related error
 */
export class AttendanceException extends AppException {
  constructor(
    code: ErrorCode,
    message: string,
    metadata?: Record<string, unknown>,
    originalError?: Error
  ) {
    super({
      code,
      message,
      statusCode: 400,
      metadata,
      originalError,
    });
    Object.setPrototypeOf(this, AttendanceException.prototype);
  }
}

/**
 * Stellar-related error
 */
export class StellarException extends AppException {
  constructor(
    code: ErrorCode,
    message: string,
    metadata?: Record<string, unknown>,
    originalError?: Error
  ) {
    super({
      code,
      message,
      statusCode: 500,
      metadata,
      originalError,
    });
    Object.setPrototypeOf(this, StellarException.prototype);
  }
}

/**
 * Database-related error
 */
export class DatabaseException extends AppException {
  constructor(
    message: string,
    metadata?: Record<string, unknown>,
    originalError?: Error
  ) {
    super({
      code: ErrorCode.DATABASE_ERROR,
      message,
      statusCode: 500,
      metadata,
      originalError,
    });
    Object.setPrototypeOf(this, DatabaseException.prototype);
  }
}

/**
 * External service error
 */
export class ExternalServiceException extends AppException {
  constructor(
    service: string,
    message: string,
    metadata?: Record<string, unknown>,
    originalError?: Error
  ) {
    super({
      code: ErrorCode.EXTERNAL_SERVICE_ERROR,
      message: `${service} error: ${message}`,
      statusCode: 503,
      metadata: {
        service,
        ...metadata,
      },
      originalError,
    });
    Object.setPrototypeOf(this, ExternalServiceException.prototype);
  }
}

/**
 * Resource not found error
 */
export class NotFoundException extends AppException {
  constructor(resource: string, identifier?: string) {
    const message =
      identifier ? `${resource} with id ${identifier} not found` : `${resource} not found`;
    super({
      code: ErrorCode.NOT_FOUND,
      message,
      statusCode: 404,
    });
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

/**
 * Internal server error
 */
export class InternalServerException extends AppException {
  constructor(message: string = 'Internal server error', originalError?: Error) {
    super({
      code: ErrorCode.INTERNAL_ERROR,
      message,
      statusCode: 500,
      originalError,
    });
    Object.setPrototypeOf(this, InternalServerException.prototype);
  }
}

