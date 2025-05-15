import SObject from "./SObject";
import Svg from "./Svg";
import SRect from "./SRect";
import "./ComponentRegistry";
import.meta.glob("./Components/*.ts", { eager: true });

export default class Scada {
    public svg: Svg;

    private _sObjects: SObject[] = [];

    constructor() {
        // Create an SVG element using the SVG 2 standard
        this.svg = new Svg('500px', '500px', '0 0 500 500');
        this.svg.Get().setAttribute('style', 'border: 1px solid black;');
        return this;
    }

    init() {

        const rect = new SRect(this, 10, 10, 100, 100);

        console.log(rect)
        this._sObjects.push(rect);

        this._sObjects.forEach((object) => {
            object.Init();
        });
        console.log("Scada initialized");
    }

    Update() {
        this._sObjects.forEach((object) => {
            object.Update();
        });
    }
    Render() {
        this._sObjects.forEach((object) => {
            object.Render();
        });
    }

    AddObject(object: SObject) {
        this._sObjects.push(object);
    }
    RemoveObject(object: SObject) {
        const index = this._sObjects.indexOf(object);
        if (index > -1) {
            this._sObjects.splice(index, 1);
        }
    }


}