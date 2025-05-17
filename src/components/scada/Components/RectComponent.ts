import Component from "./Component"
import SObject from "../SObject";
import ComponentRegistry from "../ComponentRegistry";

@ComponentRegistry.Register("RectComponent")
export default class RectComponent extends Component {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public rotation: number;
    public scale: number;
    public debugBounds: boolean = false;
    public debugBoundsColor: string = "#FF0000";
    public rect: SVGRectElement | null = null;


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
    GetPos(): { x: number, y: number } {
        return { x: this.x, y: this.y };
    }
    setSize(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
    GetSize(): { width: number, height: number } {
        return { width: this.width, height: this.height };
    }
    SetRotation(rotation: number) {
        this.rotation = rotation;
        if (this.rect) {
            this.rect.setAttribute("transform", `rotate(${this.rotation}, ${this.x + this.width / 2}, ${this.y + this.height / 2}) scale(${this.scale})`);
        }
    }
    GetRotation(): number {
        return this.rotation;
    }
    SetScale(scale: number) {
        this.scale = scale;
        if (this.rect) {
            this.rect.setAttribute("transform", `rotate(${this.rotation}, ${this.x + this.width / 2}, ${this.y + this.height / 2}) scale(${this.scale})`);
        }
    }

    GetRect(): SVGRectElement | null {
        return this.rect;
    }

    Mount() {
        this.rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this.rect.setAttribute("x", this.x.toString());
        this.rect.setAttribute("y", this.y.toString());
        this.rect.setAttribute("width", this.width.toString());
        this.rect.setAttribute("height", this.height.toString());
        this.rect.setAttribute("transform", `rotate(${this.rotation}, ${this.x + this.width / 2}, ${this.y + this.height / 2}) scale(${this.scale})`);
        if (this.debugBounds) {
            this.rect.setAttribute("stroke", this.debugBoundsColor);
            this.rect.setAttribute("fill", "none");
        }
        console.log("Mounting RectComponent", this);
        this.sObject.scada.svg.Get().appendChild(this.rect);
    }
    Update() {}
    Render() {

    }
}
console.log("RectComponent loaded");
ComponentRegistry.register("RectComponent", RectComponent);