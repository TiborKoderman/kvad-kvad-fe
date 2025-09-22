/**
 * Represents the successful result of an operation
 */
export class Ok<T> {
  readonly kind = 'ok' as const;

  constructor(public readonly value: T) {}

  isOk(): this is Ok<T> {
    return true;
  }

  isErr(): this is never {
    return false;
  }

  map<U>(fn: (value: T) => U): Result<U, never> {
    return new Ok(fn(this.value));
  }

  mapErr<F>(_fn: (error: never) => F): Result<T, F> {
    return this as Result<T, F>;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_defaultValue: T): T {
    return this.value;
  }

  unwrapOrElse(_fn: (error: never) => T): T {
    return this.value;
  }
}

/**
 * Represents the error result of an operation
 */
export class Err<E> {
  readonly kind = 'err' as const;

  constructor(public readonly error: E) {}

  isOk(): this is never {
    return false;
  }

  isErr(): this is Err<E> {
    return true;
  }

  map<U>(_fn: (value: never) => U): Result<U, E> {
    return this as Result<U, E>;
  }

  mapErr<F>(fn: (error: E) => F): Result<never, F> {
    return new Err(fn(this.error));
  }

  unwrap(): never {
    throw new Error(`Called unwrap on an Err value: ${this.error}`);
  }

  unwrapOr<T>(defaultValue: T): T {
    return defaultValue;
  }

  unwrapOrElse<T>(fn: (error: E) => T): T {
    return fn(this.error);
  }
}

/**
 * Result type that represents either success (Ok) or failure (Err)
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Creates a successful Result
 */
export function ok<T>(value: T): Ok<T> {
  return new Ok(value);
}

/**
 * Creates an error Result
 */
export function err<E>(error: E): Err<E> {
  return new Err(error);
}

/**
 * Type guard to check if a Result is Ok
 */
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.isOk();
}

/**
 * Type guard to check if a Result is Err
 */
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.isErr();
}

/**
 * Wraps a function that might throw in a Result
 */
export function tryCatch<T, E = Error>(
  fn: () => T,
  errorFn?: (error: unknown) => E
): Result<T, E> {
  try {
    return ok(fn());
  } catch (error) {
    const mappedError = errorFn ? errorFn(error) : (error as E);
    return err(mappedError);
  }
}

/**
 * Wraps an async function that might throw in a Result
 */
export async function tryCatchAsync<T, E = Error>(
  fn: () => Promise<T>,
  errorFn?: (error: unknown) => E
): Promise<Result<T, E>> {
  try {
    const value = await fn();
    return ok(value);
  } catch (error) {
    const mappedError = errorFn ? errorFn(error) : (error as E);
    return err(mappedError);
  }
}
