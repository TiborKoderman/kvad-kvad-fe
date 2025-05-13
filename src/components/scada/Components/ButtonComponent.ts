import Component from "./Component"
import ComponentRegistry from "../ComponentRegistry";
import SObject from "../SObject";

export default class ButtonComponent extends Component {
    constructor(sObject: SObject) {
        super(sObject);
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

ComponentRegistry.registerComponent("ButtonComponent", ButtonComponent);