import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Supabase Configuration
 */
const SupabaseConfigSchema = z.object({
  SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_KEY: z.string().min(1, 'Supabase service key is required'),
});

/**
 * Stellar Configuration
 */
const StellarConfigSchema = z.object({
  STELLAR_NETWORK: z.enum(['testnet', 'mainnet']).default('testnet'),
  STELLAR_HORIZON_URL: z.string().url().optional(),
  STELLAR_SOROBAN_RPC_URL: z.string().url().optional(),
});

/**
 * Application Configuration
 */
const AppConfigSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

/**
 * Combined configuration schema
 */
const EnvSchema = AppConfigSchema.merge(SupabaseConfigSchema).merge(StellarConfigSchema);

export type EnvConfig = z.infer<typeof EnvSchema>;

/**
 * EnvService
 *
 * Centralized environment variable management with validation.
 * Validates all required environment variables on initialization.
 * Throws error if any required variable is missing or invalid.
 *
 * @example
 * const env = this.envService.get('SUPABASE_URL');
 * const config = this.envService.getStellarConfig();
 */
@Injectable()
export class EnvService {
  private config!: EnvConfig;

  constructor() {
    // Load .env file
    const envFilePath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envFilePath)) {
      dotenv.config({ path: envFilePath });
    }

    // Validate environment variables
    this.validateAndSetConfig();
  }

  /**
   * Validate and set configuration
   * Throws error if validation fails
   */
  private validateAndSetConfig(): void {
    try {
      this.config = EnvSchema.parse(process.env);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = (error as unknown as z.ZodError).issues
          .map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`)
          .join('\n');

        const fullMessage = [
          '❌ Environment validation failed:',
          messages,
          '',
          '📋 Please check your .env file and ensure all required variables are set.',
          '📖 See .env.example for reference.',
        ].join('\n');

        throw new Error(fullMessage);
      }
      throw error;
    }
  }

  /**
   * Get all configuration
   */
  getConfig(): EnvConfig {
    return this.config;
  }

  /**
   * Get a specific environment variable
   */
  get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return this.config[key];
  }

  /**
   * Check if in production
   */
  isProduction(): boolean {
    return this.config.NODE_ENV === 'production';
  }

  /**
   * Check if in development
   */
  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development';
  }

  /**
   * Get Supabase configuration
   */
  getSupabaseConfig() {
    return {
      url: this.config.SUPABASE_URL,
      anonKey: this.config.SUPABASE_ANON_KEY,
      serviceKey: this.config.SUPABASE_SERVICE_KEY,
    };
  }

  /**
   * Get Stellar configuration
   */
  getStellarConfig() {
    return {
      network: this.config.STELLAR_NETWORK,
      horizonUrl:
        this.config.STELLAR_HORIZON_URL ||
        (this.config.STELLAR_NETWORK === 'testnet'
          ? 'https://horizon-testnet.stellar.org'
          : 'https://horizon.stellar.org'),
      sorobanRpcUrl:
        this.config.STELLAR_SOROBAN_RPC_URL ||
        (this.config.STELLAR_NETWORK === 'testnet'
          ? 'https://soroban-testnet.stellar.org'
          : 'https://soroban.stellar.org'),
    };
  }
}

