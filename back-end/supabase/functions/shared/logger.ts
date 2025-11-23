import { getSupabaseClient } from "./supabase-client.ts"

export type LogLevel = "debug" | "info" | "warn" | "error"

export interface LogEntry {
  level: LogLevel
  context: string
  message: string
  metadata?: Record<string, unknown>
  operationId?: string
  errorStack?: string
}

class Logger {
  private context: string
  private operationId?: string

  constructor(context: string, operationId?: string) {
    this.context = context
    this.operationId = operationId
  }

  async debug(message: string, metadata?: Record<string, unknown>) {
    await this.log("debug", message, metadata)
  }

  async info(message: string, metadata?: Record<string, unknown>) {
    await this.log("info", message, metadata)
  }

  async warn(message: string, metadata?: Record<string, unknown>) {
    await this.log("warn", message, metadata)
  }

  async error(message: string, metadata?: Record<string, unknown>, error?: Error) {
    const errorStack = error?.stack
    await this.log("error", message, metadata, errorStack)
  }

  private async log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    errorStack?: string
  ) {
    // Console output
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`, {
      ...(metadata && { metadata }),
      ...(this.operationId && { operationId: this.operationId }),
    })

    // Database logging (fire-and-forget)
    try {
      const supabase = getSupabaseClient()
      await supabase.from("logs").insert({
        level,
        context: this.context,
        message,
        metadata: metadata || null,
        operation_id: this.operationId || null,
        error_stack: errorStack || null,
      })
    } catch (err) {
      console.error("Failed to log to database:", err)
    }
  }
}

export function createLogger(context: string, operationId?: string): Logger {
  return new Logger(context, operationId)
}

