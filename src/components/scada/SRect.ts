import SObject from './SObject';
export default class SRect extends SObject {


    constructor(x: number, y: number, width: number, height: number) {
        super();
        this.AddComponent("RectComponent", x, y, width, height, 0, 1);
        this.AddComponent("OnClickComponent", (event: MouseEvent) => {
            console.log("SRect clicked", event);
        });
    }
}