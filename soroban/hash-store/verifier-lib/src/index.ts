import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
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
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

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
    super(
      new ContractSpec([ "AAAAAAAAAEBBcHBlbmRzIGEgMzItYnl0ZSBoYXNoIHRvIHRoZSBsaXN0IGZvciBhIGdpdmVuIGV2ZW50IGlkZW50aWZpZXIuAAAACGFkZF9oYXNoAAAAAgAAAAAAAAAIZXZlbnRfaWQAAAAOAAAAAAAAAARoYXNoAAAD7gAAACAAAAAA",
        "AAAAAAAAAEVSZXR1cm5zIGFsbCBoYXNoZXMgc3RvcmVkIGZvciB0aGUgZXZlbnQuIEVtcHR5IGlmIHRoZSBldmVudCBoYXMgbm9uZS4AAAAAAAAKZ2V0X2hhc2hlcwAAAAAAAQAAAAAAAAAIZXZlbnRfaWQAAAAOAAAAAQAAA+oAAAPuAAAAIA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    add_hash: this.txFromJSON<null>,
        get_hashes: this.txFromJSON<Array<Buffer>>
  }
}