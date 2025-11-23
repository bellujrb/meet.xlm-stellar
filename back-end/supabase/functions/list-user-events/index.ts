// @ts-ignore - Deno import
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { getSupabaseClient } from "../shared/supabase-client.ts"
import { createLogger } from "../shared/logger.ts"
import { extractWalletAddress, validateWalletAddress } from "../shared/auth.ts"
import { createErrorResponse, createSuccessResponse, ErrorCode, AppError } from "../shared/error-handler.ts"
import { handleCorsPreFlight } from "../shared/cors.ts"

const logger = createLogger("list-user-events")

serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreFlight(req)
  if (corsResponse) return corsResponse

  if (req.method !== "GET") {
    return createErrorResponse("Method not allowed", 405)
  }

  try {
    // Extract and validate wallet address (required for this endpoint)
    const walletAddress = extractWalletAddress(req)
    const auth = validateWalletAddress(walletAddress)
    if (!auth.valid || !auth.walletAddress) {
      return createErrorResponse("Missing or invalid x-wallet-address header", 401, ErrorCode.UNAUTHORIZED)
    }

    const log = createLogger("list-user-events")
    
    // Parse query parameters
    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get("limit") || "50", 10)
    const offset = parseInt(url.searchParams.get("offset") || "0", 10)

    if (limit > 100) {
      return createErrorResponse("Limit cannot exceed 100", 400)
    }

    await log.info("Listing user events", {
      walletAddress: auth.walletAddress,
      limit,
      offset,
    })

    const supabase = getSupabaseClient()

    // Get user's registered events
    const { data: attendances, error: attendanceError } = await supabase
      .from("event_attendances")
      .select("event_id")
      .eq("user_wallet", auth.walletAddress)
      .order("registered_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (attendanceError) {
      await log.error("Database query failed", { error: attendanceError.message })
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Failed to list user events",
        500
      )
    }

    const eventIds = attendances?.map((a) => a.event_id) || []

    if (eventIds.length === 0) {
      return createSuccessResponse({
        events: [],
        count: 0,
        limit,
        offset,
      })
    }

    // Get events details
    const { data: events, error: eventsError } = await supabase
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
      .in("event_id", eventIds)
      .order("start_time", { ascending: true })

    if (eventsError) {
      await log.error("Database query failed", { error: eventsError.message })
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Failed to list user events",
        500
      )
    }

    // Get attendance counts for each event
    let attendanceCounts: Record<string, number> = {}
    if (eventIds.length > 0) {
      const { data: counts } = await supabase
        .from("event_attendances")
        .select("event_id")
        .in("event_id", eventIds)

      if (counts) {
        attendanceCounts = counts.reduce((acc, att) => {
          acc[att.event_id] = (acc[att.event_id] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
    }

    // Format response
    const formattedEvents = (events || []).map((event) => ({
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
      attendees: attendanceCounts[event.event_id] || 0,
      is_registered: true, // All events in this list are registered
    }))

    await log.info("User events listed successfully", {
      count: formattedEvents.length,
    })

    return createSuccessResponse({
      events: formattedEvents,
      count: formattedEvents.length,
      limit,
      offset,
    })
  } catch (err) {
    if (err instanceof AppError) {
      return createErrorResponse(err.message, err.statusCode, err.code)
    }
    console.error("Error listing user events:", err)
    return createErrorResponse("Internal server error", 500)
  }
})

