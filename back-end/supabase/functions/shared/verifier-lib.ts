// @ts-ignore - Deno import
import { Buffer } from "https://esm.sh/buffer@6.0.3"
// @ts-ignore - Deno import
import * as StellarSDK from 'https://esm.sh/@stellar/stellar-sdk@14.1.1'

// Import contract module using alternative URL format
// @ts-ignore - Deno import - esm.sh may not support /contract subpath, try alternative
let ContractModule: any
try {
  // Try the standard subpath first
  ContractModule = await import('https://esm.sh/@stellar/stellar-sdk@14.1.1/contract')
} catch (e1) {
  try {
    // Try with .js extension
    ContractModule = await import('https://esm.sh/@stellar/stellar-sdk@14.1.1/contract/index.js')
  } catch (e2) {
    try {
      // Try accessing from main SDK
      // @ts-ignore
      ContractModule = StellarSDK.contract || StellarSDK
    } catch (e3) {
      // Last resort: use npm CDN format
      ContractModule = await import('https://cdn.esm.sh/@stellar/stellar-sdk@14.1.1/contract')
    }
  }
}

// Extract exports from contract module
const AssembledTransaction = ContractModule.AssembledTransaction || ContractModule.default?.AssembledTransaction
const ContractClient = ContractModule.Client || ContractModule.default?.Client  
const ContractSpec = ContractModule.Spec || ContractModule.default?.Spec

// Type exports - use any for now since types may not be available
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

// Re-export contract types and classes
export { AssembledTransaction, ContractClient, ContractSpec }
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

// Make sure we have the required exports
if (!AssembledTransaction || !ContractClient || !ContractSpec) {
  throw new Error('Failed to load Stellar SDK contract module. Required exports not found.')
}

// @ts-ignore - Deno import
export * from 'https://esm.sh/@stellar/stellar-sdk@14.1.1'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  futurenet: {
    networkPassphrase: "Test SDF Future Network ; October 2022",
    contractId: "CDDCZS36ZERM7L2C4H6CC3PYYQPLWR357BOEJROMTL4X5WLVDNO4GSLI",
  }
} as const


export interface Client {
  /**
   * Construct and simulate a add_hash transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Appends a 32-byte hash to the list for a given event identifier.
   */
  add_hash: ({event_id, hash}: {event_id: Buffer, hash: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_hashes transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Returns all hashes stored for the event. Empty if the event has none.
   */
  get_hashes: ({event_id}: {event_id: Buffer}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Buffer>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    // @ts-ignore - ContractSpec constructor signature may vary
    super(
      new ContractSpec([ "AAAAAAAAAEBBcHBlbmRzIGEgMzItYnl0ZSBoYXNoIHRvIHRoZSBsaXN0IGZvciBhIGdpdmVuIGV2ZW50IGlkZW50aWZpZXIuAAAACGFkZF9oYXNoAAAAAgAAAAAAAAAIZXZlbnRfaWQAAAAOAAAAAAAAAARoYXNoAAAD7gAAACAAAAAA",
        "AAAAAAAAAEVSZXR1cm5zIGFsbCBoYXNoZXMgc3RvcmVkIGZvciB0aGUgZXZlbnQuIEVtcHR5IGlmIHRoZSBldmVudCBoYXMgbm9uZS4AAAAAAAAKZ2V0X2hhc2hlcwAAAAAAAQAAAAAAAAAIZXZlbnRfaWQAAAAOAAAAAQAAA+oAAAPuAAAAIA==" ]),
      options
    )
  }
  // @ts-ignore - txFromJSON is a method from ContractClient that exists at runtime
  public readonly fromJSON = {
    // @ts-ignore
    add_hash: this.txFromJSON<null>,
    // @ts-ignore
    get_hashes: this.txFromJSON<Array<Buffer>>
  }
}