// @ts-ignore - Deno import
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { getSupabaseClient } from "../shared/supabase-client.ts"
import { createLogger } from "../shared/logger.ts"
import { extractWalletAddress, validateWalletAddress } from "../shared/auth.ts"
import { createErrorResponse, createSuccessResponse, ErrorCode, AppError } from "../shared/error-handler.ts"
import { handleCorsPreFlight } from "../shared/cors.ts"

const logger = createLogger("list-events")

serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCorsPreFlight(req)
  if (corsResponse) return corsResponse

  if (req.method !== "GET") {
    return createErrorResponse("Method not allowed", 405)
  }

  try {
    // Extract and validate wallet address (optional for listing)
    const walletAddress = extractWalletAddress(req)
    const auth = validateWalletAddress(walletAddress)

    const log = createLogger("list-events")
    
    // Parse query parameters
    const url = new URL(req.url)
    const status = url.searchParams.get("status") // LIVE, UPCOMING, ENDED
    const registeredParam = url.searchParams.get("registered") // true, false, or null
    const limit = parseInt(url.searchParams.get("limit") || "50", 10)
    const offset = parseInt(url.searchParams.get("offset") || "0", 10)

    if (limit > 100) {
      return createErrorResponse("Limit cannot exceed 100", 400)
    }

    // Parse registered filter
    let registeredFilter: boolean | null = null
    if (registeredParam === "true") {
      registeredFilter = true
    } else if (registeredParam === "false") {
      registeredFilter = false
    }

    await log.info("Listing events", {
      walletAddress: auth.walletAddress || "anonymous",
      status,
      registered: registeredFilter,
      limit,
      offset,
    })

    const supabase = getSupabaseClient()

    // If user is authenticated, get registered event IDs first (needed for filtering)
    let registeredEventIds: string[] = []
    if (auth.valid && auth.walletAddress) {
      const { data: attendances } = await supabase
        .from("event_attendances")
        .select("event_id")
        .eq("user_wallet", auth.walletAddress)

      if (attendances) {
        registeredEventIds = attendances.map((a) => a.event_id)
      }
    }

    // Build query with proper filtering to avoid duplicates
    let query = supabase
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
      `, { count: "exact" })

    // Filter by status if provided
    if (status && ["LIVE", "UPCOMING", "ENDED"].includes(status)) {
      query = query.eq("status", status)
    }

    // Filter by registration status if user is authenticated and filter is specified
    // Note: We'll filter after the query for non-registered events to avoid complex SQL
    let shouldFilterAfterQuery = false
    if (auth.valid && auth.walletAddress && registeredFilter !== null) {
      if (registeredFilter === true) {
        // Only show registered events - can filter in query
        if (registeredEventIds.length > 0) {
          query = query.in("event_id", registeredEventIds)
        } else {
          // User has no registered events, return empty
          return createSuccessResponse({
            events: [],
            count: 0,
            limit,
            offset,
          })
        }
      } else {
        // Only show non-registered events - filter after query
        shouldFilterAfterQuery = true
      }
    }

    // Apply ordering and pagination
    query = query
      .order("start_time", { ascending: true })
      .range(offset, offset + limit - 1)

    const { data: events, error: queryError } = await query

    if (queryError) {
      await log.error("Database query failed", { error: queryError.message })
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Failed to list events",
        500
      )
    }

    // Remove duplicates (safety check)
    let uniqueEvents = (events || []).filter((event, index, self) =>
      index === self.findIndex((e) => e.event_id === event.event_id)
    )

    // Filter out registered events if needed (for non-registered filter)
    if (shouldFilterAfterQuery && registeredEventIds.length > 0) {
      uniqueEvents = uniqueEvents.filter(
        (event) => !registeredEventIds.includes(event.event_id)
      )
    }

    // Get attendance counts for each event
    const eventIds = uniqueEvents.map((e) => e.event_id)
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
    const formattedEvents = uniqueEvents.map((event) => ({
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
      is_registered: registeredEventIds.includes(event.event_id),
    }))

    await log.info("Events listed successfully", {
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
    console.error("Error listing events:", err)
    return createErrorResponse("Internal server error", 500)
  }
})

