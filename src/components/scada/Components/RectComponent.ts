import Component from "./Component"
import ComponentRegistry from "../ComponentRegistry";
import SObject from "../SObject";

export default class RectComponent extends Component {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public rotation: number;
    public scale: number;
    public debugBounds: boolean = false;
    public debugBoundsColor: string = "#FF0000";


    constructor(sObject: SObject, x: number, y: number, width: number, height: number, rotation = 0, scale= 1) {
        super(sObject);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.scale = scale;
    }

    setPos(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    getPos(): { x: number, y: number } {
        return { x: this.x, y: this.y };
    }
    setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
    getSize(): { width: number, height: number } {
        return { width: this.width, height: this.height };
    }
    setRotation(rotation: number) {
        this.rotation = rotation;
    }
    getRotation(): number {
        return this.rotation;
    }
    setScale(scale: number) {
        this.scale = scale;
    }


    init() {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", this.x.toString());
        rect.setAttribute("y", this.y.toString());
        rect.setAttribute("width", this.width.toString());
        rect.setAttribute("height", this.height.toString());
        rect.setAttribute("transform", `rotate(${this.rotation}, ${this.x + this.width / 2}, ${this.y + this.height / 2}) scale(${this.scale})`);
        if (this.debugBounds) {
            rect.setAttribute("stroke", this.debugBoundsColor);
            rect.setAttribute("fill", "none");
        }
        this.sObject.scada.svg.Get().appendChild(rect);
    }
    Update() {}
    Render() {

    }
}

ComponentRegistry.registerComponent("RectComponent", RectComponent);