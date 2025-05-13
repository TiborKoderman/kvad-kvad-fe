import SObject from "../SObject";

export default class Component {

    public sObject: SObject;

    constructor(sObject: SObject) {
        this.sObject = sObject;
    }

    Mount(): void {}

    Update(): void {}

    Render(): void {}

    Unmount(): void {}

}