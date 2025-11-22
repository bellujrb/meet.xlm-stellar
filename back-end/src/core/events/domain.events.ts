/**
 * Domain Events
 *
 * Core events that drive the system.
 * Events are immutable and represent something that happened.
 */

import { randomUUID } from 'crypto';

export abstract class DomainEvent {
  readonly id: string = randomUUID();
  readonly aggregateId: string;
  readonly timestamp: Date = new Date();
  readonly version: number = 1;

  constructor(aggregateId: string) {
    this.aggregateId = aggregateId;
  }

  abstract getEventType(): string;
  abstract getEventName(): string;
}

// ============================================================================
// EVENT EVENTS
// ============================================================================

/**
 * Fired when an event is created
 */
export class EventCreatedEvent extends DomainEvent {
  constructor(
    readonly eventId: string,
    readonly title: string,
    readonly organizerId: string,
    readonly organizerAddress: string,
    readonly metadata: Record<string, unknown>
  ) {
    super(eventId);
  }

  getEventType(): string {
    return 'event.created';
  }

  getEventName(): string {
    return 'Event Created';
  }
}

/**
 * Fired when an event is updated
 */
export class EventUpdatedEvent extends DomainEvent {
  constructor(
    readonly eventId: string,
    readonly changes: Record<string, unknown>
  ) {
    super(eventId);
  }

  getEventType(): string {
    return 'event.updated';
  }

  getEventName(): string {
    return 'Event Updated';
  }
}

// ============================================================================
// ATTENDANCE EVENTS
// ============================================================================

/**
 * Fired when a user registers for an event
 */
export class AttendanceRegisteredEvent extends DomainEvent {
  constructor(
    readonly attendanceId: string,
    readonly eventId: string,
    readonly userAddress: string,
    readonly registeredAt: Date,
    readonly metadata: Record<string, unknown>
  ) {
    super(attendanceId);
  }

  getEventType(): string {
    return 'attendance.registered';
  }

  getEventName(): string {
    return 'Attendance Registered';
  }
}

/**
 * Fired when attendance is confirmed (badge minted)
 */
export class AttendanceConfirmedEvent extends DomainEvent {
  constructor(
    readonly attendanceId: string,
    readonly eventId: string,
    readonly badgeId: string,
    readonly transactionHash: string,
    readonly confirmedAt: Date
  ) {
    super(attendanceId);
  }

  getEventType(): string {
    return 'attendance.confirmed';
  }

  getEventName(): string {
    return 'Attendance Confirmed';
  }
}

// ============================================================================
// BADGE EVENTS
// ============================================================================

/**
 * Fired when a badge is minted on Stellar
 */
export class BadgeMintedEvent extends DomainEvent {
  constructor(
    readonly badgeId: string,
    readonly eventId: string,
    readonly userAddress: string,
    readonly transactionHash: string,
    readonly assetCode: string,
    readonly metadata: Record<string, unknown>
  ) {
    super(badgeId);
  }

  getEventType(): string {
    return 'badge.minted';
  }

  getEventName(): string {
    return 'Badge Minted';
  }
}

/**
 * Fired when badge minting fails
 */
export class BadgeMintFailedEvent extends DomainEvent {
  constructor(
    readonly badgeId: string,
    readonly eventId: string,
    readonly userAddress: string,
    readonly reason: string,
    readonly error?: string
  ) {
    super(badgeId);
  }

  getEventType(): string {
    return 'badge.mint.failed';
  }

  getEventName(): string {
    return 'Badge Mint Failed';
  }
}

// ============================================================================
// STELLAR EVENTS
// ============================================================================

/**
 * Fired when a Stellar transaction is initiated
 */
export class StellarTransactionInitiatedEvent extends DomainEvent {
  constructor(
    readonly txId: string,
    readonly operation: string,
    readonly sourceAccount: string,
    readonly destinationAccount?: string,
    readonly amount?: string
  ) {
    super(txId);
  }

  getEventType(): string {
    return 'stellar.tx.initiated';
  }

  getEventName(): string {
    return 'Stellar Transaction Initiated';
  }
}

/**
 * Fired when a Stellar transaction is confirmed
 */
export class StellarTransactionConfirmedEvent extends DomainEvent {
  constructor(
    readonly txId: string,
    readonly transactionHash: string,
    readonly ledger: number,
    readonly confirmedAt: Date
  ) {
    super(txId);
  }

  getEventType(): string {
    return 'stellar.tx.confirmed';
  }

  getEventName(): string {
    return 'Stellar Transaction Confirmed';
  }
}

/**
 * Fired when a Stellar transaction fails
 */
export class StellarTransactionFailedEvent extends DomainEvent {
  constructor(
    readonly txId: string,
    readonly reason: string,
    readonly error?: string
  ) {
    super(txId);
  }

  getEventType(): string {
    return 'stellar.tx.failed';
  }

  getEventName(): string {
    return 'Stellar Transaction Failed';
  }
}

// ============================================================================
// SYSTEM EVENTS
// ============================================================================

/**
 * Fired when the system starts
 */
export class SystemStartedEvent extends DomainEvent {
  override readonly version: number = 1;

  constructor(
    readonly appVersion: string,
    readonly environment: string
  ) {
    super('system');
  }

  getEventType(): string {
    return 'system.started';
  }

  getEventName(): string {
    return 'System Started';
  }
}

/**
 * Fired when an error occurs
 */
export class SystemErrorEvent extends DomainEvent {
  constructor(
    readonly context: string,
    readonly error: string,
    readonly stack?: string
  ) {
    super('system');
  }

  getEventType(): string {
    return 'system.error';
  }

  getEventName(): string {
    return 'System Error';
  }
}

export type AppDomainEvent =
  | EventCreatedEvent
  | EventUpdatedEvent
  | AttendanceRegisteredEvent
  | AttendanceConfirmedEvent
  | BadgeMintedEvent
  | BadgeMintFailedEvent
  | StellarTransactionInitiatedEvent
  | StellarTransactionConfirmedEvent
  | StellarTransactionFailedEvent
  | SystemStartedEvent
  | SystemErrorEvent;

