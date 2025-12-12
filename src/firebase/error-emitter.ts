/**
 * This is a simple event emitter that we'll use to broadcast errors from our
 * Firebase services to our UI components.
 *
 * We're using a simple event emitter here, but you could also use a more
 * robust library like `eventemitter3` or `mitt`.
 *
 * This is a client-side only module, so we can use browser-specific APIs
 * like `Event` and `EventTarget`.
 */

class EventEmitter<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  private eventTarget = new EventTarget();

  /**
   * Registers an event handler for the given event name.
   */
  public on<K extends keyof T>(
    eventName: K,
    listener: (payload: T[K]) => void
  ) {
    this.eventTarget.addEventListener(eventName as string, (event) => {
      const customEvent = event as CustomEvent<T[K]>;
      listener(customEvent.detail);
    });
  }

  /**
   * Removes an event handler for the given event name.
   */
  public off<K extends keyof T>(
    eventName: K,
    listener: (payload: T[K]) => void
  ) {
    this.eventTarget.removeEventListener(eventName as string, (event) => {
      const customEvent = event as CustomEvent<T[K]>;
      listener(customEvent.detail);
    });
  }

  /**
   * Dispatches an event with the given name and payload.
   */
  public emit<K extends keyof T>(eventName: K, payload: T[K]) {
    const event = new CustomEvent(eventName as string, {detail: payload});
    this.eventTarget.dispatchEvent(event);
  }
}

/**
 * We're creating a new event emitter that will be used to broadcast errors
 * from our Firebase services to our UI components.
 *
 * We're defining the event types here so that we can get type-safe access to
 * the event names and payloads.
 */
export const errorEmitter = new EventEmitter<{
  'permission-error': Error;
}>();
