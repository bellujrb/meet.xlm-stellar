// @ts-ignore - Deno import
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { getSupabaseClient } from "../shared/supabase-client.ts"
import { createLogger } from "../shared/logger.ts"
import { extractWalletAddress, validateWalletAddress } from "../shared/auth.ts"
import { createErrorResponse, createSuccessResponse, ErrorCode, AppError } from "../shared/error-handler.ts"
import { handleCorsPreFlight } from "../shared/cors.ts"

const logger = createLogger("get-event")

serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreFlight(req)
  if (corsResponse) return corsResponse

  if (req.method !== "GET") {
    return createErrorResponse("Method not allowed", 405)
  }

  try {
    // Extract and validate wallet address (optional)
    const walletAddress = extractWalletAddress(req)
    const auth = validateWalletAddress(walletAddress)

    const log = createLogger("get-event")
    
    // Parse query parameters
    const url = new URL(req.url)
    const eventId = url.searchParams.get("event_id")

    if (!eventId || eventId.trim().length === 0) {
      return createErrorResponse("Missing event_id parameter", 400)
    }

    await log.info("Getting event", {
      walletAddress: auth.walletAddress || "anonymous",
      eventId,
    })

    const supabase = getSupabaseClient()

    // Get event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select(`
        event_id,
        title,
        organizer,
        organizer_icon,
        start_time,
        location,
        description,
        image_url,
        status,
        requires_xlm,
        xlm_minimum,
        created_by,
        created_at
      `)
      .eq("event_id", eventId)
      .single()

    if (eventError || !event) {
      await log.warn("Event not found", { eventId, error: eventError?.message })
      return createErrorResponse("Event not found", 404, ErrorCode.NOT_FOUND)
    }

    // Check if user is registered (if authenticated)
    let isRegistered = false
    if (auth.valid && auth.walletAddress) {
      const { data: attendance } = await supabase
        .from("event_attendances")
        .select("attendance_id")
        .eq("event_id", eventId)
        .eq("user_wallet", auth.walletAddress)
        .single()

      isRegistered = !!attendance
    }

    // Get attendance count
    const { count: attendeesCount } = await supabase
      .from("event_attendances")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId)

    // Format response
    const response = {
      id: event.event_id,
      event_id: event.event_id,
      title: event.title,
      organizer: event.organizer,
      organizer_icon: event.organizer_icon,
      time: event.start_time,
      location: event.location,
      description: event.description,
      image: event.image_url,
      status: event.status,
      requires_xlm: event.requires_xlm,
      xlm_minimum: event.xlm_minimum ? parseFloat(event.xlm_minimum) : null,
      created_by: event.created_by,
      created_at: event.created_at,
      attendees: attendeesCount || 0,
      is_registered: isRegistered,
    }

    await log.info("Event retrieved successfully", {
      eventId,
      title: event.title,
    })

    return createSuccessResponse(response)
  } catch (err) {
    if (err instanceof AppError) {
      return createErrorResponse(err.message, err.statusCode, err.code)
    }
    console.error("Error getting event:", err)
    return createErrorResponse("Internal server error", 500)
  }
})

