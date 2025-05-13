import Component from "./Component"
import ComponentRegistry from "../ComponentRegistry";
import SObject from "../SObject";

export default class DeviceComponent implements Component {
    private sObject: SObject;

    constructor(sObject: SObject) {
        this.sObject = sObject;
    }
    Mount() {
        this.sObject.Init();
    }

    Update() {
        this.sObject.Update();
    }

    Render() {
        this.sObject.Render();
    }

    Unmount() {
        this.sObject.RemoveComponent(this.sObject.constructor.name);
    }
}

ComponentRegistry.registerComponent("DeviceComponent", DeviceComponent);