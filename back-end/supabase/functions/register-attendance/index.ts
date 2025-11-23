// @ts-ignore - Deno import
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { getSupabaseClient } from "../shared/supabase-client.ts"
import { createLogger } from "../shared/logger.ts"
import { extractWalletAddress, validateWalletAddress } from "../shared/auth.ts"
import { createErrorResponse, createSuccessResponse, ErrorCode, AppError } from "../shared/error-handler.ts"
import { handleCorsPreFlight } from "../shared/cors.ts"

const logger = createLogger("register-attendance")

serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreFlight(req)
  if (corsResponse) return corsResponse

  if (req.method !== "POST") {
    return createErrorResponse("Method not allowed", 405)
  }

  try {
    // Extract and validate wallet address
    const walletAddress = extractWalletAddress(req)
    const auth = validateWalletAddress(walletAddress)
    if (!auth.valid || !auth.walletAddress) {
      return createErrorResponse("Missing or invalid x-wallet-address header", 401, ErrorCode.UNAUTHORIZED)
    }

    // Parse request body
    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return createErrorResponse("Invalid JSON body", 400)
    }

    // Validate request
    const eventId = body.event_id as string

    if (!eventId || typeof eventId !== "string" || eventId.trim().length === 0) {
      return createErrorResponse("Missing or invalid event_id", 400)
    }

    const log = createLogger("register-attendance")
    await log.info("Registering attendance", {
      walletAddress: auth.walletAddress,
      eventId,
    })

    const supabase = getSupabaseClient()

    // Check if event exists
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("event_id, title, requires_xlm, xlm_minimum")
      .eq("event_id", eventId)
      .single()

    if (eventError || !event) {
      await log.warn("Event not found", { eventId, error: eventError?.message })
      return createErrorResponse("Event not found", 404, ErrorCode.NOT_FOUND)
    }

    // Check if user is already registered
    const { data: existingAttendance } = await supabase
      .from("event_attendances")
      .select("attendance_id")
      .eq("event_id", eventId)
      .eq("user_wallet", auth.walletAddress)
      .single()

    if (existingAttendance) {
      await log.info("User already registered", {
        walletAddress: auth.walletAddress,
        eventId,
      })
      return createErrorResponse("Already registered for this event", 409, ErrorCode.CONFLICT)
    }

    // Generate attendance_id
    const attendanceId = crypto.randomUUID()

    // Insert attendance
    const { data: attendance, error: insertError } = await supabase
      .from("event_attendances")
      .insert({
        attendance_id: attendanceId,
        event_id: eventId,
        user_wallet: auth.walletAddress,
      })
      .select()
      .single()

    if (insertError) {
      await log.error("Database insert failed", { error: insertError.message })
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Failed to register attendance",
        500
      )
    }

    await log.info("Attendance registered successfully", {
      attendanceId,
      eventId,
      walletAddress: auth.walletAddress,
    })

    const response = {
      attendance_id: attendanceId,
      event_id: eventId,
      event_title: event.title,
      user_wallet: auth.walletAddress,
      registered_at: attendance.registered_at,
    }

    return createSuccessResponse(response, 201)
  } catch (err) {
    if (err instanceof AppError) {
      return createErrorResponse(err.message, err.statusCode, err.code)
    }
    console.error("Error registering attendance:", err)
    return createErrorResponse("Internal server error", 500)
  }
})

