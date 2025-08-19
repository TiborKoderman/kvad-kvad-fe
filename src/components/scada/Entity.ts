import Component from "./Components/Component";
import Scada from "./Scada";
import ComponentRegistry from "./ComponentRegistry";

export default class SObject {


    private _components = new Map<string, Component>();
    public scada: Scada | null = null;

    constructor(...components: Component[]) {
        components.forEach((component) => {
            this._components.set(component.constructor.name, component);
        });
    }

    Mount(scada: Scada) {
        this.scada = scada;
        this._components.forEach((component) => {
            component.Mount();
        });
    }
    Update() {
        this._components.forEach((component) => {
            component.Update();
        });
    }

    Render() {
        this._components.forEach((component) => {
            component.Render();
        });
    }

    AddComponent(name: string, ...args: unknown[]) {
        const component = ComponentRegistry.get(name);
        if (!component) {
            throw new Error(`Component ${name} not found in registry`);
        }
        else{
            const ComponentCtor = component as new (...args: unknown[]) => Component;
            this._components.set(name, new ComponentCtor(this, ...args));
        }
    }

    GetComponent<T extends Component>(name: string): T | undefined {
        const component = this._components.get(name) as T | undefined;
        return component ? component as T : undefined;
    }

    RemoveComponent(name: string) {
        this._components.delete(name);
    }

}
