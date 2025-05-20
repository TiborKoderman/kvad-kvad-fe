// ComponentRegistry.ts

export type ComponentConstructor = new (...args: unknown[]) => unknown

console.log('ComponentRegistry loaded')

export default class ComponentRegistry {
  private static registry = new Map<string, ComponentConstructor>()

  constructor() {
    console.log('ComponentRegistry initialized')
  }

  static register(name: string, component: ComponentConstructor): void {
    console.log(`Registering component: ${name}`)
    this.registry.set(name, component)
  }

  static Register(name: string) {
    return (constructor: ComponentConstructor) => {
      console.log(`Registering component: ${name}`)
      this.registry.set(name, constructor)
    }
  }

  static get(name: string): ComponentConstructor | undefined {
    return this.registry.get(name)
  }

  static create<T = unknown>(name: string, ...args: unknown[]): T | undefined {
    const Ctor = this.registry.get(name)
    return Ctor ? (new Ctor(...args) as T) : undefined
  }

  static has(name: string): boolean {
    return this.registry.has(name)
  }

  static remove(name: string): void {
    this.registry.delete(name)
  }

  /**
   * Autowire properties from other registered components into the target instance.
   * Usage: ComponentRegistry.autowire(targetInstance, ['OtherComponent']);
   * This will attach properties named 'otherComponent' (camelCase) to the target.
   */
  static autowire(target: any, componentNames: string[]) {
    for (const name of componentNames) {
      const Ctor = this.registry.get(name)
      if (Ctor) {
        // Use camelCase property name
        const propName = name.charAt(0).toLowerCase() + name.slice(1)
        target[propName] = new Ctor()
      }
    }
  }

  static Autowire(componentNames: string[]) {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {
      return class extends constructor {
        constructor(...args: any[]) {
          super(...args)
          ComponentRegistry.autowire(this, componentNames)
        }
      }
    }
  }

  /**
   * Autowire and ensure dependencies for a component.
   * Usage: ComponentRegistry.dependencies(targetInstance, ['OtherComponent', ...])
   * This will attach properties and throw if any dependency is missing.
   */
  static dependencies(target: any, componentNames: string[]) {
    for (const name of componentNames) {
      const Ctor = this.registry.get(name)
      if (!Ctor) {
        throw new Error(
          `Dependency "${name}" is not registered in ComponentRegistry.`,
        )
      }
      const propName = name.charAt(0).toLowerCase() + name.slice(1)
      target[propName] = new Ctor()
      if (!target[propName]) {
        throw new Error(
          `Dependency property "${propName}" could not be instantiated on target.`,
        )
      }
    }
  }
}

// export default new ComponentRegistry();
export function Autowire(componentNames: string[]) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args)
        ComponentRegistry.autowire(this, componentNames)
      }
    }
  }
}