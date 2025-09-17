// Eris - Elegant HTTP Client with Builder Pattern

interface RequestConfig {
  params?: Record<string, unknown>
  headers?: Record<string, string>
  signal?: AbortSignal
}

interface BuilderConfig {
  baseURL: string
  headers?: Headers
  maxRetries?: number
}

type JWToken = `${string}.${string}.${string}`

interface IAuthorization<T> {
  authType: 'none' | 'basic' | 'bearer' | 'custom'
  get?: () => T
  handler?: (ctx: Ctx) => void | Promise<void>
}

export const BearerAuthorization: IAuthorization<JWToken> = {
  authType: 'bearer',
  handler: async (ctx: Ctx) => {
    if (typeof BearerAuthorization.get !== "function") return
    ctx.init.headers = ctx.init.headers || {}
    ctx.init.headers["Authorization"] = `Bearer ${BearerAuthorization.get()}`
  }
}

export const BasicAuthorization: IAuthorization<string> = {
  authType: 'basic',
  handler: async (ctx: Ctx) => {
    if (typeof BasicAuthorization.get !== "function") return
    ctx.init.headers = ctx.init.headers || {}
    ctx.init.headers["Authorization"] = `Basic ${BasicAuthorization.get()}`
  }
}

type Hook = (ctx: Ctx) => void | STOP | Promise<void | STOP>
export const STOP = Symbol('stop')
type STOP = typeof STOP

export class Interceptors {
  private items: Hook[] = []

  use(hook: Hook): void {
    this.items.push(hook)
  }

  clear(): void {
    this.items = []
  }

  all(): Hook[] {
    return this.items.slice()
  }

  compose(): Hook {
    const fns = this.all()

    if (fns.length === 0) {
      return async (): Promise<void> => {
        // Empty hook
      }
    }

    if (fns.length === 1) {
      const f0 = fns[0]
      return async (ctx: Ctx): Promise<void | STOP> => {
        return await f0(ctx)
      }
    }

    return (ctx: Ctx): Promise<void | STOP> => {
      return fns.reduce<Promise<void | STOP>>(
        (acc, fn) =>
          acc.then(prev => {
            if (prev === STOP) return STOP as STOP
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
  onRequest: Interceptors = new Interceptors()
  onRequestError: Interceptors = new Interceptors()
  onSend: Interceptors = new Interceptors()
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
  url: string
  init: RequestInit & { headers: Record<string, string> }
  request?: Request
  response?: Response
  parsed?: unknown
  attempt: number
  meta: Record<string, unknown>
}

// Chainable response interface
export interface ErisResponse {
  json<T = unknown>(): Promise<T>
  text(): Promise<string>
  blob(): Promise<Blob>
  arrayBuffer(): Promise<ArrayBuffer>
  response(): Promise<Response>
}

// Implementation of chainable response
class ErisResponseImpl implements ErisResponse {
  constructor(private responsePromise: Promise<Response>) {}

  async json<T = unknown>(): Promise<T> {
    const response = await this.responsePromise
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.json()
  }

  async text(): Promise<string> {
    const response = await this.responsePromise
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.text()
  }

  async blob(): Promise<Blob> {
    const response = await this.responsePromise
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.blob()
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    const response = await this.responsePromise
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response.arrayBuffer()
  }

  async response(): Promise<Response> {
    return this.responsePromise
  }
}

export class ErisBuilder {
  methods: ApiMethod[] = defaultMethods
  interceptors: InterceptorManager = new InterceptorManager()
  authorization?: IAuthorization<unknown>

  constructor(private config: BuilderConfig) {}

  useAuthorization<T>(auth: IAuthorization<T>): ErisBuilder {
    this.authorization = auth
    return this
  }

  addMethod(name: string, hasBody: boolean = false): ErisBuilder {
    this.methods.push({ name: Symbol(name), body: hasBody })
    return this
  }

  intercept(lifecycle: keyof InterceptorManager, hook: Hook): ErisBuilder {
    const interceptorInstance = this.interceptors[lifecycle]
    if (interceptorInstance instanceof Interceptors) {
      interceptorInstance.use(hook)
    }
    return this
  }

  build(): Eris {
    return new Eris(
      this.config,
      this.methods,
      this.interceptors.compose(),
      this.authorization
    )
  }
}

export class Eris {
  private baseURL: string
  private headers: Headers
  private maxRetries: number
  private lifecycle: Required<Lifecycle>
  private authorization?: IAuthorization<unknown>

  constructor(
    config: BuilderConfig,
    methods: ApiMethod[],
    lifecycle: Required<Lifecycle>,
    authorization?: IAuthorization<unknown>
  ) {
    this.baseURL = config.baseURL
    this.headers = config.headers || new Headers()
    this.maxRetries = config.maxRetries || 3
    this.lifecycle = lifecycle
    this.authorization = authorization

    // Dynamically create HTTP method functions
    methods.forEach(method => {
      const methodName = method.name.description || 'unknown'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(this as any)[methodName] = this.createMethodHandler(methodName, method.body)
    })
  }

  private createMethodHandler(methodName: string, hasBody: boolean = false) {
    return (
      url: string,
      dataOrConfig?: unknown,
      config?: RequestConfig
    ): ErisResponse => {
      let data: unknown
      let requestConfig: RequestConfig = {}

      if (hasBody) {
        data = dataOrConfig
        requestConfig = config || {}
      } else {
        requestConfig = (dataOrConfig as RequestConfig) || {}
      }

      const responsePromise = this.executeRequest(methodName, url, data, requestConfig)
      return new ErisResponseImpl(responsePromise)
    }
  }

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const url = new URL(path, this.baseURL)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  private async executeRequest(
    method: string,
    url: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<Response> {
    const fullUrl = this.buildUrl(url, config.params)
    const headers: Record<string, string> = {}

    // Copy default headers
    this.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Merge additional headers
    if (config.headers) {
      Object.assign(headers, config.headers)
    }

    const ctx: Ctx = {
      url: fullUrl,
      init: {
        method: method.toUpperCase(),
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: config.signal,
      },
      attempt: 0,
      meta: {},
    }

    // Set content-type for body requests
    if (data && !headers['Content-Type']) {
      ctx.init.headers['Content-Type'] = 'application/json'
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      ctx.attempt = attempt

      try {
        // Apply authorization if configured
        if (this.authorization?.handler) {
          await this.authorization.handler(ctx)
        }

        // Execute lifecycle hooks and make the request
        await this.lifecycle.onInit(ctx)
        await this.lifecycle.onRequest(ctx)

        const response = await this.request(ctx)
        ctx.response = response

        await this.lifecycle.onResponse(ctx)
        await this.lifecycle.onFinally(ctx)

        return response
      } catch (error) {
        lastError = error as Error

        if (error instanceof TypeError) {
          await this.lifecycle.onNetworkError(ctx)
        } else {
          await this.lifecycle.onRequestError(ctx)
        }

        // Don't retry on last attempt
        if (attempt === this.maxRetries) {
          break
        }

        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      } finally {
        await this.lifecycle.onFinally(ctx)
      }
    }

    throw lastError || new Error('Request failed after all retries')
  }

  private async request(ctx: Ctx): Promise<Response> {
    await this.lifecycle.onSend(ctx)

    // Build the Request instance if not already built
    if (!ctx.request) {
      ctx.request = new Request(ctx.url, {
        ...ctx.init,
        headers: new Headers(ctx.init.headers)
      })
    }

    return fetch(ctx.request)
  }

  // Explicitly defined HTTP methods for TypeScript support
  get!: (url: string, config?: RequestConfig) => ErisResponse
  post!: (url: string, data?: unknown, config?: RequestConfig) => ErisResponse
  put!: (url: string, data?: unknown, config?: RequestConfig) => ErisResponse
  delete!: (url: string, config?: RequestConfig) => ErisResponse
  patch!: (url: string, data?: unknown, config?: RequestConfig) => ErisResponse
  head!: (url: string, config?: RequestConfig) => ErisResponse
  options!: (url: string, config?: RequestConfig) => ErisResponse
}

// Factory function for easy usage
export function createClient(config: BuilderConfig): ErisBuilder {
  return new ErisBuilder(config)
}

// Usage examples:
// const api = createClient({ baseURL: 'https://api.example.com' })
//   .useAuthorization(BearerAuthorization)
//   .intercept('onRequest', (ctx) => console.log('Making request:', ctx.url))
//   .build()
//
// Smart parsing based on content-type:
// const users = await api.get('/users').json<User[]>()
// const text = await api.get('/readme').text()
// const response = await api.get('/status').response()
//
// Manual control:
// await api.post('/users', { name: 'John' }).json()
// await api.put('/users/123', formData).text()
