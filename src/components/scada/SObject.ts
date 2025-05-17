import Component from "./Components/Component";
import Scada from "./Scada";
import ComponentRegistry from "./ComponentRegistry";
import RectComponent from "./Components/RectComponent";

export default class SObject {


    private _components = new Map<string, Component>();
    public scada: Scada;

    constructor(scada: Scada, ...components: Component[]) {
        this.scada = scada;
        components.forEach((component) => {
            this._components.set(component.constructor.name, component);
        });

    }
    Init() {
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

    GetComponent(name: string): Component | undefined {
        return this._components.get(name);
    }

    RemoveComponent(name: string) {
        this._components.delete(name);
    }

}