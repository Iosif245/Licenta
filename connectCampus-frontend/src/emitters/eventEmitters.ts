import { EventType } from './EventType';

/**
 * Event emitter to subscribe, dispatch, and unsubscribe to events.
 */
const eventEmitter: {
  readonly events: Record<string, (() => void)[]>;
  emit(eventType: EventType): void;
  subscribe(eventType: EventType, callback: () => void): void;
  unsubscribe(eventType: EventType): void;
} = {
  // This is event object to store events.
  events: {},
  // This will dispatch the event and call the callback for every event.
  emit(eventName) {
    if (!this.events[eventName]) return;
    this.events[eventName].forEach((callback: () => void) => callback());
  },
  // This will subscribe the event with a specific callback
  subscribe(eventName, callback) {
    if (!this.events[eventName]) this.events[eventName] = [];
    if (!this.events[eventName]?.includes(this.events[eventName][0])) this.events[eventName]?.push(callback);
  },
  // This will unsubscribe the event to avoid unnecessary event calls
  unsubscribe(eventName) {
    if (!this.events[eventName]) return;
    delete this.events[eventName];
  },
};

export default eventEmitter;
