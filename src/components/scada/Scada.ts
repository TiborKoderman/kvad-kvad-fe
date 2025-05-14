import SObject from "./SObject";
import Svg from "./Svg";
import RectComponent from "./Components/RectComponent";
import SRect from "./SRect";

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

        this._sObjects.push(new SRect(this, 10, 10, 100, 100));

        this._sObjects.forEach((object) => {
            object.Init();
        });
        console.log('Scada component initialized');

        console.log();
        

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


}