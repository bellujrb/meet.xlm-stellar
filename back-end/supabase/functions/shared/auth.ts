import { createLogger } from "./logger.ts"

const logger = createLogger("auth")

export interface AuthResult {
  valid: boolean
  walletAddress?: string
}

export function extractWalletAddress(req: Request): string | null {
  const header = req.headers.get("x-wallet-address")
  return header || null
}

export function validateWalletAddress(walletAddress: string | null): AuthResult {
  if (!walletAddress) {
    return { valid: false }
  }

  // Basic validation for Stellar wallet address format
  // Stellar addresses are typically 56 characters and start with G
  if (walletAddress.length < 56 || !walletAddress.startsWith("G")) {
    return { valid: false }
  }

  return {
    valid: true,
    walletAddress,
  }
}

