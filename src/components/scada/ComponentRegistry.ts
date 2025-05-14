// ComponentRegistry.ts

export type ComponentConstructor = new (...args: unknown[]) => unknown;

console.log("ComponentRegistry loaded");


export default class ComponentRegistry {
  private static registry = new Map<string, ComponentConstructor>();

  static register(name: string, component: ComponentConstructor): void {
    console.log(`Registering component: ${name}`);
    this.registry.set(name, component);
  }

  static get(name: string): ComponentConstructor | undefined {
    return this.registry.get(name);
  }

  static create<T = unknown>(name: string, ...args: unknown[]): T | undefined {
    const Ctor = this.registry.get(name);
    return Ctor ? (new Ctor(...args) as T) : undefined;
  }

  static has(name: string): boolean {
    return this.registry.has(name);
  }

  static remove(name: string): void {
    this.registry.delete(name);
  }
}
