export class Result<T, E> {
  private readonly ok?: T;
  private readonly err?: E;

  private constructor(ok?: T, err?: E) {
    this.ok = ok;
    this.err = err;
  }

  static Ok<T, E>(value: T): Result<T, E> {
    return new Result<T, E>(value, undefined);
  }

  static Err<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(undefined, error);
  }

  isOk(): boolean {
    return this.err === undefined;
  }

  isErr(): boolean {
    return this.ok === undefined;
  }

  unwrap(): T {
    if (this.isOk()) {
      return this.ok as T;
    }
    throw new Error('Called unwrap on an Err value');
  }

  unwrapErr(): E {
    if (this.isErr()) {
      return this.err as E;
    }
    throw new Error('Called unwrapErr on an Ok value');
  }
}
