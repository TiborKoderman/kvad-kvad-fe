import Component from "./Component"
import RectComponent from "./RectComponent";
import SObject from "../SObject";
import ComponentRegistry from "../ComponentRegistry";

@ComponentRegistry.Register("OnClickComponent")
export default class OnClickComponent extends Component {

    private _rectComponent: RectComponent | null = null;

    public onClick: (event: MouseEvent) => void;

    constructor(sObject: SObject, onClick: (event: MouseEvent) => void) {
        super(sObject);
        this.onClick = (event: MouseEvent) => {
            console.log("OnClickComponent clicked", event);
        };
    }
    Mount() {
        this._rectComponent = this.sObject.GetComponent("RectComponent") as RectComponent;
        const rect = this._rectComponent.GetRect();
        if (rect) {
            rect.addEventListener('click', this.onClick);
        }
        else {
            console.error("OnClickComponent: RectComponent not found");
        }
    }
    Update() {}
    Render() {
    }
    Unmount() {
        const rect = this._rectComponent?.GetRect();
        if (rect) {
            rect.removeEventListener('click', this.onClick);
        }
    }
}
console.log("OnClickComponent loaded");
ComponentRegistry.register("OnClickComponent", OnClickComponent);