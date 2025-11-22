import { createLogger } from "./logger.ts"
import { createCorsHeaders } from "./cors.ts"

const logger = createLogger("error-handler")

export enum ErrorCode {
  INVALID_REQUEST = "INVALID_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 500,
    public metadata?: Record<string, unknown>
  ) {
    super(message)
    this.name = "AppError"
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
    }
  }
}

export async function handleError(
  error: unknown,
  operationId?: string
): Promise<{ response: Response; logged: boolean }> {
  let appError: AppError

  if (error instanceof AppError) {
    appError = error
  } else if (error instanceof Error) {
    appError = new AppError(
      ErrorCode.INTERNAL_ERROR,
      error.message,
      500,
      { originalError: error.name }
    )
  } else {
    appError = new AppError(
      ErrorCode.INTERNAL_ERROR,
      "Unknown error occurred",
      500
    )
  }

  // Log the error
  const log = createLogger("error-handler", operationId)
  await log.error(appError.message, appError.metadata, error instanceof Error ? error : undefined)

  // Return formatted response
  const response = new Response(
    JSON.stringify({
      error: appError.message,
      code: appError.code,
      ...(operationId && { operation_id: operationId }),
    }),
    {
      status: appError.statusCode,
      headers: { "Content-Type": "application/json" },
    }
  )

  return { response, logged: true }
}

export function createErrorResponse(
  message: string,
  statusCode: number = 400,
  code: ErrorCode = ErrorCode.INVALID_REQUEST
): Response {
  return new Response(
    JSON.stringify({
      error: message,
      code,
    }),
    {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
        ...createCorsHeaders(),
      },
    }
  )
}

export function createSuccessResponse<T>(data: T, statusCode: number = 200): Response {
  return new Response(
    JSON.stringify(data),
    {
      status: statusCode,
      headers: {
        "Content-Type": "application/json",
        ...createCorsHeaders(),
      },
    }
  )
}

