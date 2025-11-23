// @ts-ignore - Deno import
import { Buffer } from "https://esm.sh/buffer@6.0.3"
// @ts-ignore - Deno import
import * as StellarSDK from 'https://esm.sh/@stellar/stellar-sdk@14.1.1'

// Import contract module - lazy initialization to avoid top-level await
// @ts-ignore - Deno import - esm.sh may not support /contract subpath
let ContractModule: any = null
let contractModulePromise: Promise<any> | null = null

// Initialize contract module (lazy - no top-level await)
function initContractModule() {
  if (ContractModule) return Promise.resolve(ContractModule)
  if (contractModulePromise) return contractModulePromise
  
  contractModulePromise = (async () => {
    try {
      // Try the standard subpath first
      ContractModule = await import('https://esm.sh/@stellar/stellar-sdk@14.1.1/contract')
    } catch (e1) {
      try {
        // Try with .js extension
        // @ts-ignore - Dynamic import may not resolve in TypeScript
        ContractModule = await import('https://esm.sh/@stellar/stellar-sdk@14.1.1/contract/index.js')
      } catch (e2) {
        try {
          // Try accessing from main SDK
          // @ts-ignore
          ContractModule = StellarSDK.contract || StellarSDK
        } catch (e3) {
          // Last resort: use npm CDN format
          // @ts-ignore - Dynamic import may not resolve in TypeScript
          ContractModule = await import('https://cdn.esm.sh/@stellar/stellar-sdk@14.1.1/contract')
        }
      }
    }
    return ContractModule
  })()
  
  return contractModulePromise
}

// Get contract exports (lazy)
async function getContractExports() {
  const module = await initContractModule()
  return {
    AssembledTransaction: module.AssembledTransaction || module.default?.AssembledTransaction,
    ContractClient: module.Client || module.default?.Client,
    ContractSpec: module.Spec || module.default?.Spec,
  }
}

// Type exports
type ContractClientOptions = any
type MethodOptions = any
type Result<T> = any
type u32 = any
type i32 = any
type u64 = any
type i64 = any
type u128 = any
type i128 = any
type u256 = any
type i256 = any
type Option<T> = T | null
type Typepoint = any
type Duration = any

// Re-export types
export type { 
  ContractClientOptions,
  MethodOptions,
  Result,
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
}

// Export AssembledTransaction type (will be available after init)
export type AssembledTransaction<T> = any

// @ts-ignore - Deno import
export * from 'https://esm.sh/@stellar/stellar-sdk@14.1.1'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CCBMKHFNQNZGDO7UYWURJ3GE3TK566QCW7QXFP46JYX4IUVVDWLQNF57",
  },
  futurenet: {
    networkPassphrase: "Test SDF Future Network ; October 2022",
    contractId: "CCBMKHFNQNZGDO7UYWURJ3GE3TK566QCW7QXFP46JYX4IUVVDWLQNF57",
  }
} as const

export class Client {
  private _client: any = null
  
  static async deploy<T = Client>(
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        wasmHash: Buffer | string;
        salt?: Buffer | Uint8Array;
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    const exports = await getContractExports()
    return exports.ContractClient.deploy(null, options)
  }
  
  constructor(public readonly options: ContractClientOptions) {
    // Client will be initialized lazily when needed
  }
  
  private async getClient() {
    if (this._client) return this._client
    
    const exports = await getContractExports()
    const spec = new exports.ContractSpec([ 
      "AAAAAAAAAEBBcHBlbmRzIGEgMzItYnl0ZSBoYXNoIHRvIHRoZSBsaXN0IGZvciBhIGdpdmVuIGV2ZW50IGlkZW50aWZpZXIuAAAACGFkZF9oYXNoAAAAAgAAAAAAAAAIZXZlbnRfaWQAAAAOAAAAAAAAAARoYXNoAAAD7gAAACAAAAAA",
      "AAAAAAAAAEVSZXR1cm5zIGFsbCBoYXNoZXMgc3RvcmVkIGZvciB0aGUgZXZlbnQuIEVtcHR5IGlmIHRoZSBldmVudCBoYXMgbm9uZS4AAAAAAAAKZ2V0X2hhc2hlcwAAAAAAAQAAAAAAAAAIZXZlbnRfaWQAAAAOAAAAAQAAA+oAAAPuAAAAIA==" 
    ])
    this._client = new exports.ContractClient(spec, this.options)
    return this._client
  }
  
  async add_hash(params: {event_id: Buffer, hash: Buffer}, options?: any): Promise<AssembledTransaction<null>> {
    const client = await this.getClient()
    return client.add_hash(params, options)
  }
  
  async get_hashes(params: {event_id: Buffer}, options?: any): Promise<AssembledTransaction<Array<Buffer>>> {
    const client = await this.getClient()
    return client.get_hashes(params, options)
  }
  
  // @ts-ignore - txFromJSON is a method from ContractClient that exists at runtime
  public readonly fromJSON = {
    // @ts-ignore
    add_hash: async (json: string) => {
      const client = await this.getClient()
      // @ts-ignore
      return client.txFromJSON(json)
    },
    // @ts-ignore
    get_hashes: async (json: string) => {
      const client = await this.getClient()
      // @ts-ignore
      return client.txFromJSON(json)
    }
  }
}
