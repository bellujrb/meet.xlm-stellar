// Type declarations for @stellar/stellar-sdk/contract module
declare module 'https://esm.sh/@stellar/stellar-sdk@14.1.1/contract' {
  export class AssembledTransaction<T> {
    result?: T;
    hash?: string;
    simulate(): Promise<{ result?: T }>;
    signAndSend(keypair: any): Promise<{ hash: string; status?: string; [key: string]: any }>;
    sign(keypair: any): AssembledTransaction<T>;
    send(): Promise<{ hash: string; status?: string; [key: string]: any }>;
  }

  export class Client {
    constructor(spec: Spec, options: ClientOptions);
    static deploy<T>(wasmHash: any, options: any): Promise<AssembledTransaction<T>>;
    txFromJSON<T>(json: string): AssembledTransaction<T>;
  }

  export class Spec {
    constructor(...args: any[]);
  }

  export interface ClientOptions {
    contractId: string;
    networkPassphrase: string;
    rpcUrl: string;
  }

  export interface MethodOptions {
    fee?: number;
    timeoutInSeconds?: number;
    simulate?: boolean;
  }

  export interface Result<T> {
    result?: T;
  }

  export type u32 = number;
  export type i32 = number;
  export type u64 = bigint;
  export type i64 = bigint;
  export type u128 = bigint;
  export type i128 = bigint;
  export type u256 = bigint;
  export type i256 = bigint;
  export type Option<T> = T | null;
  export type Typepoint = bigint;
  export type Duration = bigint;
}

