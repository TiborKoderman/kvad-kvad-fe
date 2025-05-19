import Component from "./Component"
import SObject from "../SObject";
import ComponentRegistry from "../ComponentRegistry";

@ComponentRegistry.Register("TextComponent")
export default class TextComponent extends Component {

    private _textElement: SVGTextElement | null = null;
    private _text: string = "";
    private _fontSize: number = 12;
    private _fontFamily: string = "Arial";
    private _fontWeight: string = "normal";
    private _fontStyle: string = "normal";
    private _textAnchor: string = "start";


    constructor(sObject: SObject) {
        super(sObject);
    }
    setText(text: string) {
        this._text = text;
    }
    getText(): string {
        return this._text;
    }

    Mount() {}
    Update() {}
    Render() {

    }
}
console.log("TextComponent loaded");
ComponentRegistry.register("TextComponent", TextComponent);