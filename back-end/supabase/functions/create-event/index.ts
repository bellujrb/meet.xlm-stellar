// @ts-ignore - Deno import
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { getSupabaseClient } from "../shared/supabase-client.ts"
import { createLogger } from "../shared/logger.ts"
import { extractWalletAddress, validateWalletAddress } from "../shared/auth.ts"
import { createErrorResponse, createSuccessResponse, ErrorCode, AppError } from "../shared/error-handler.ts"
import { handleCorsPreFlight } from "../shared/cors.ts"

const logger = createLogger("create-event")

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
    const title = body.title as string
    const organizer = body.organizer as string
    const organizerIcon = body.organizerIcon as string
    const startTime = body.startTime as string
    const location = body.location as string
    const description = body.description as string | undefined
    const imageUrl = body.imageUrl as string | undefined
    const requiresXlm = body.requiresXlm as boolean | undefined
    const xlmMinimum = body.xlmMinimum as number | undefined

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return createErrorResponse("Missing or invalid title", 400)
    }
    if (!organizer || typeof organizer !== "string" || organizer.trim().length === 0) {
      return createErrorResponse("Missing or invalid organizer", 400)
    }
    if (!startTime || typeof startTime !== "string") {
      return createErrorResponse("Missing or invalid startTime", 400)
    }
    if (!location || typeof location !== "string" || location.trim().length === 0) {
      return createErrorResponse("Missing or invalid location", 400)
    }

    // Validate date
    const startDate = new Date(startTime)
    if (isNaN(startDate.getTime())) {
      return createErrorResponse("Invalid startTime format", 400)
    }

    // Validate XLM requirements if provided
    if (requiresXlm && (!xlmMinimum || typeof xlmMinimum !== "number" || xlmMinimum <= 0)) {
      return createErrorResponse("xlmMinimum must be a positive number when requiresXlm is true", 400)
    }

    const log = createLogger("create-event")
    await log.info("Creating event", {
      walletAddress: auth.walletAddress,
      title,
      organizer,
      startTime,
    })

    const supabase = getSupabaseClient()

    // Generate event_id
    const eventId = crypto.randomUUID()

    // Determine status based on start time
    const now = new Date()
    const status = startDate <= now ? "LIVE" : "UPCOMING"

    // Insert into database
    const { data, error: insertError } = await supabase
      .from("events")
      .insert({
        event_id: eventId,
        title: title.trim(),
        organizer: organizer.trim(),
        organizer_icon: organizerIcon || "🎉",
        start_time: startTime,
        location: location.trim(),
        description: description?.trim() || null,
        image_url: imageUrl || null,
        status,
        requires_xlm: requiresXlm || false,
        xlm_minimum: xlmMinimum || null,
        created_by: auth.walletAddress,
      })
      .select()
      .single()

    if (insertError) {
      await log.error("Database insert failed", { error: insertError.message })
      throw new AppError(
        ErrorCode.DATABASE_ERROR,
        "Failed to create event",
        500
      )
    }

    await log.info("Event created successfully", {
      eventId,
      title,
      status,
    })

    const response = {
      event_id: eventId,
      title: data.title,
      organizer: data.organizer,
      organizer_icon: data.organizer_icon,
      start_time: data.start_time,
      location: data.location,
      description: data.description,
      image_url: data.image_url,
      status: data.status,
      requires_xlm: data.requires_xlm,
      xlm_minimum: data.xlm_minimum ? parseFloat(data.xlm_minimum) : null,
      created_by: data.created_by,
      created_at: data.created_at,
    }

    return createSuccessResponse(response, 201)
  } catch (err) {
    if (err instanceof AppError) {
      return createErrorResponse(err.message, err.statusCode, err.code)
    }
    console.error("Error creating event:", err)
    return createErrorResponse("Internal server error", 500)
  }
})

