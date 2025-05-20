import SObject from "./SObject";
import Svg from "./Svg";
import "./ComponentRegistry";
import.meta.glob("./Components/*.ts", { eager: true });

interface ScadaOptions {
    width: string;
    height: string;
    viewBox: string;
    autoresize: boolean;
    backgroundColor: string;
    border: string;
}

export default class Scada {
    public svg: Svg;

    private _sObjects: SObject[] = [];

    constructor(options: Partial<ScadaOptions> = {}) {
        const defaultOptions: ScadaOptions = {
            width: "100%",
            height: "100%",
            viewBox: "0 0 500 500",
            autoresize: true,
            backgroundColor: "#FFFFFF00",
            border: "1px solid gray",
        };
        const finalOptions = { ...defaultOptions, ...options };
        this.svg = new Svg(
            finalOptions.width,
            finalOptions.height,
            finalOptions.viewBox
        );
        // Create an SVG element using the SVG 2 standard
        this.svg = new Svg(finalOptions.width, finalOptions.height, finalOptions.viewBox);
        this.svg.Get().setAttribute('style', 'border: 1px solid black;');
        this.svg.AddLayer("background");
        this.svg.AddLayer("objects");
        this.svg.AddLayer("annotations");
        this.svg.GetLayer("background")?.setAttribute("style", `background-color: ${finalOptions.backgroundColor};`);
        return this;
    }

    init() {
        this._sObjects.forEach((object) => {
            object.Mount(this);
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
        object.Mount(this);
    }
    RemoveObject(object: SObject) {
        const index = this._sObjects.indexOf(object);
        if (index > -1) {
            this._sObjects.splice(index, 1);
        }
    }

}