export class ErisBuilder {
  methods: ApiMethod[]
  interceptors: InterceptorManager = new InterceptorManager()
  authorization?: IAuthorization<unknown>

  constructor(private config: BuilderConfig) {
  }

  useAuthorization<T>(auth: IAuthorization<T>): void {
    this.authorization = auth
  }

}

interface BuilderConfig {
  baseURL: string
  defaultParser?: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'response'
  headers?: Headers
  maxRetries?: number
}

type JWToken = `${string}.${string}.${string}`
interface IAuthorization<T> {
  authType: 'none' | 'basic' | 'bearer' | 'custom'
  get?:  () => T
  handler?: (ctx: Ctx) => void | Promise<void>
}

const BearerAuthorization: IAuthorization<JWToken> = {
  authType: 'bearer',
  handler: async (ctx: Ctx) => {
    if (typeof BearerAuthorization.get !== "function") return
    ctx.init.headers["Authorization"] = `Bearer ${BearerAuthorization.get()}`
  }
}

const BasicAuthorization: IAuthorization<string> = {
  authType: 'basic',
  handler: async (ctx: Ctx) => {
    if (typeof BasicAuthorization.get !== "function") return
    ctx.init.headers["Authorization"] = `Basic ${BasicAuthorization.get()}`
  }
}

type Hook = (ctx: Ctx) => void | STOP | Promise<void | STOP>

export const STOP = Symbol('stop')
type STOP = typeof STOP

export class Interceptors {
  private items: Hook[] = []
  use(hook: Hook) {
    this.items.push(hook)
  }
  clear() {
    this.items = []
  }
  all(): Hook[] {
    // copy so a caller can’t mutate our internal array
    return this.items.slice()
  }

  compose(): Hook {
    const fns = this.all()

    if (fns.length === 0) {
      // no-op that keeps the same signature
      return async (_: Ctx): Promise<void> => {}
    }

    if (fns.length === 1) {
      const f0 = fns[0]
      return async (ctx: Ctx): Promise<void | STOP> => {
        // await handles both sync and async hook
        return await f0(ctx)
      }
    }

    // multi-hook compiled runner (promise chaining, no try/catch)
    return (ctx: Ctx): Promise<void | STOP> => {
      return fns.reduce<Promise<void | STOP>>(
        (acc, fn) =>
          acc.then(prev => {
            // If a previous hook asked to STOP, keep propagating STOP without invoking further hooks
            if (prev === STOP) return STOP as STOP
            // Run next hook; errors naturally bubble as rejected promises
            return Promise.resolve(fn(ctx)).then(res =>
              res === STOP ? STOP : undefined,
            )
          }),
        Promise.resolve<void | STOP>(undefined),
      )
    }
  }
}

export interface ApiMethod {
  name: symbol
  body?: boolean
}

const defaultMethods: ApiMethod[] = [
  { name: Symbol('get') },
  { name: Symbol('post'), body: true },
  { name: Symbol('put'), body: true },
  { name: Symbol('delete') },
  { name: Symbol('patch'), body: true },
  { name: Symbol('head') },
  { name: Symbol('options') },
]

interface Lifecycle {
  onInit?: Hook
  onRequest?: Hook
  onRequestError?: Hook
  onSend?: Hook
  onResponse?: Hook
  onHttpError?: Hook
  onParse?: Hook
  onNetworkError?: Hook
  onFinally?: Hook
}

class InterceptorManager {
  onInit: Interceptors = new Interceptors()

  // Request lifecycle hooks
  onRequest: Interceptors = new Interceptors()
  onRequestError: Interceptors = new Interceptors()
  onSend: Interceptors = new Interceptors()

  // Response lifecycle hooks
  onResponse: Interceptors = new Interceptors()
  onHttpError: Interceptors = new Interceptors()
  onParse: Interceptors = new Interceptors()
  onNetworkError: Interceptors = new Interceptors()
  onFinally: Interceptors = new Interceptors()

  compose(): Required<Lifecycle> {
    return {
      onInit: this.onInit.compose(),
      onRequest: this.onRequest.compose(),
      onRequestError: this.onRequestError.compose(),
      onSend: this.onSend.compose(),
      onResponse: this.onResponse.compose(),
      onHttpError: this.onHttpError.compose(),
      onParse: this.onParse.compose(),
      onNetworkError: this.onNetworkError.compose(),
      onFinally: this.onFinally.compose(),
    }
  }
}

export type Ctx = {
  url: string // final URL (after baseURL, params)
  init: RequestInit // fetch options (headers, method, body, signal...)
  request?: Request // built Request
  response?: Response // fetch result
  parsed?: unknown // parsed body to return
  attempt: number // retry count
  meta: Record<string, unknown> // scratchpad for hooks (timers, cache keys, etc.)
}

export class Eris {
  private baseURL: string
  private defaultParser: 'json' | 'text' | 'blob' | 'arrayBuffer' | 'response'
  private headers: Headers
  private maxRetries: number
  private lifecycle: Required<Lifecycle>
  private authorization?: IAuthorization<unknown>

  public async request(ctx: Ctx): Promise<Response> {
    this.lifecycle.onInit(ctx)

    // Build the Request instance
    if (!ctx.request) {
      ctx.request = new Request(ctx.url, ctx.init)
    }

    // Run the onRequest hooks
  }
}
