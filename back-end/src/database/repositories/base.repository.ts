import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseException } from '@core/errors/app.exceptions';
import { LoggerService } from '@core/logger/logger.service';

/**
 * Base Repository
 *
 * Generic repository pattern for Supabase database operations.
 * Provides common CRUD operations and error handling.
 *
 * @example
 * export class EventRepository extends BaseRepository<Event> {
 *   constructor(supabase, logger) {
 *     super('events', supabase, logger);
 *   }
 * }
 */
export abstract class BaseRepository<T extends Record<string, unknown>> {
  protected logger;

  constructor(
    protected tableName: string,
    protected supabase: SupabaseClient,
    protected loggerService: LoggerService
  ) {
    this.logger = this.loggerService.createLogger(`${tableName}Repository`);
  }

  /**
   * Find by ID
   */
  async findById(id: string): Promise<T | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        throw error;
      }

      return data as T;
    } catch (error) {
      this.logger.error(`Failed to find by id: ${id}`, error);
      throw new DatabaseException(`Failed to find ${this.tableName} by id`, { id });
    }
  }

  /**
   * Find all
   */
  async findAll(limit?: number, offset?: number): Promise<T[]> {
    try {
      let query = this.supabase.from(this.tableName).select('*');

      if (limit) {
        query = query.limit(limit);
      }

      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []) as T[];
    } catch (error) {
      this.logger.error('Failed to find all', error);
      throw new DatabaseException(`Failed to find all ${this.tableName}`);
    }
  }

  /**
   * Find by filter
   */
  async findByFilter(filters: Record<string, unknown>): Promise<T[]> {
    try {
      let query = this.supabase.from(this.tableName).select('*');

      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []) as T[];
    } catch (error) {
      this.logger.error('Failed to find by filter', error, { filters });
      throw new DatabaseException(`Failed to find ${this.tableName} by filter`);
    }
  }

  /**
   * Create
   */
  async create(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();

      if (error) {
        throw error;
      }

      this.logger.info(`Created new ${this.tableName}`, {
        id: (result as unknown as Record<string, unknown>).id,
      });

      return result as T;
    } catch (error) {
      this.logger.error('Failed to create', error);
      throw new DatabaseException(`Failed to create ${this.tableName}`, {}, error as Error);
    }
  }

  /**
   * Update
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      this.logger.info(`Updated ${this.tableName}`, { id });

      return result as T;
    } catch (error) {
      this.logger.error(`Failed to update: ${id}`, error);
      throw new DatabaseException(`Failed to update ${this.tableName}`, { id });
    }
  }

  /**
   * Delete
   */
  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.supabase.from(this.tableName).delete().eq('id', id);

      if (error) {
        throw error;
      }

      this.logger.info(`Deleted ${this.tableName}`, { id });
    } catch (error) {
      this.logger.error(`Failed to delete: ${id}`, error);
      throw new DatabaseException(`Failed to delete ${this.tableName}`, { id });
    }
  }

  /**
   * Upsert
   */
  async upsert(id: string, data: T): Promise<T> {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .upsert({ ...data, id }, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        throw error;
      }

      this.logger.info(`Upserted ${this.tableName}`, { id });

      return result as T;
    } catch (error) {
      this.logger.error(`Failed to upsert: ${id}`, error);
      throw new DatabaseException(`Failed to upsert ${this.tableName}`, { id });
    }
  }

  /**
   * Count records
   */
  async count(filters?: Record<string, unknown>): Promise<number> {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          query = query.eq(key, value);
        }
      }

      const { count, error } = await query;

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      this.logger.error('Failed to count', error);
      throw new DatabaseException(`Failed to count ${this.tableName}`);
    }
  }
}

