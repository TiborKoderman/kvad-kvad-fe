# @kvad/result

A TypeScript Result type library for handling success and error states in a functional programming style.

## Installation

```bash
npm install @kvad/result
```

## Usage

The Result type represents either success (`Ok`) or failure (`Err`), providing a safe way to handle operations that might fail without throwing exceptions.

### Basic Usage

```typescript
import { ok, err, Result } from '@kvad/result';

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err('Division by zero');
  }
  return ok(a / b);
}

const result = divide(10, 2);

if (result.isOk()) {
  console.log('Result:', result.value); // Result: 5
} else {
  console.log('Error:', result.error);
}
```

### Mapping Values

```typescript
import { ok } from '@kvad/result';

const result = ok(5)
  .map(x => x * 2)
  .map(x => x.toString());

console.log(result.unwrap()); // "10"
```

### Error Handling

```typescript
import { tryCatch } from '@kvad/result';

const result = tryCatch(() => {
  return JSON.parse('{"valid": "json"}');
});

if (result.isOk()) {
  console.log('Parsed:', result.value);
} else {
  console.log('Parse error:', result.error);
}
```

### Async Operations

```typescript
import { tryCatchAsync } from '@kvad/result';

const result = await tryCatchAsync(async () => {
  const response = await fetch('/api/data');
  return response.json();
});
```

## API

### Types

- `Result<T, E>` - Union type of `Ok<T> | Err<E>`
- `Ok<T>` - Success variant containing a value of type `T`
- `Err<E>` - Error variant containing an error of type `E`

### Functions

- `ok<T>(value: T): Ok<T>` - Creates a successful Result
- `err<E>(error: E): Err<E>` - Creates an error Result
- `isOk<T, E>(result: Result<T, E>): boolean` - Type guard for Ok
- `isErr<T, E>(result: Result<T, E>): boolean` - Type guard for Err
- `tryCatch<T, E>(fn: () => T, errorFn?: (error: unknown) => E): Result<T, E>` - Wraps a function that might throw
- `tryCatchAsync<T, E>(fn: () => Promise<T>, errorFn?: (error: unknown) => E): Promise<Result<T, E>>` - Wraps an async function that might throw

### Methods

#### Ok<T>

- `isOk(): boolean` - Returns true
- `isErr(): boolean` - Returns false
- `map<U>(fn: (value: T) => U): Result<U, never>` - Maps the Ok value
- `mapErr<F>(fn: (error: never) => F): Result<T, F>` - No-op for Ok
- `unwrap(): T` - Returns the contained value
- `unwrapOr(defaultValue: T): T` - Returns the contained value
- `unwrapOrElse(fn: (error: never) => T): T` - Returns the contained value

#### Err<E>

- `isOk(): boolean` - Returns false
- `isErr(): boolean` - Returns true
- `map<U>(fn: (value: never) => U): Result<U, E>` - No-op for Err
- `mapErr<F>(fn: (error: E) => F): Result<never, F>` - Maps the Err value
- `unwrap(): never` - Throws an error
- `unwrapOr<T>(defaultValue: T): T` - Returns the default value
- `unwrapOrElse<T>(fn: (error: E) => T): T` - Returns the result of calling fn with the error

## License

MIT