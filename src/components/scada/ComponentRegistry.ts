import Component from "./Components/Component";

type ComponentConstructor = new (...args: unknown[]) => Component;

export default class ComponentRegistry {
    private static registry: Map<string, ComponentConstructor> = new Map();

    static registerComponent(name: string, componentConstructor: ComponentConstructor): void {
        this.registry.set(name, componentConstructor);
    }

    static create(name:string, ...args: unknown[]): Component | undefined {
        const componentConstructor = this.registry.get(name);
        if (componentConstructor) {
            return new componentConstructor(...args);
        }
        console.warn(`Component ${name} not found in registry.`);
        return undefined;
    }

    static has(name: string): boolean {
        return this.registry.has(name);
    }
}