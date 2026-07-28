export type EventDecodeErrorCode =
  | 'INVALID_EVENT_INPUT'
  | 'EMPTY_TOPICS'
  | 'TOPIC_DECODE_FAILED'
  | 'VALUE_DECODE_FAILED'
  | 'UNSUPPORTED_EVENT';

export class EventDecodeError extends Error {
  public readonly code: EventDecodeErrorCode;

  constructor(code: EventDecodeErrorCode, message: string) {
    super(message);
    this.name = 'EventDecodeError';
    this.code = code;
  }
}
