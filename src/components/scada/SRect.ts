import SObject from './SObject';
import Scada from './Scada';
export default class SRect extends SObject {


    constructor(scada: Scada, x: number, y: number, width: number, height: number) {
        super(scada);
        this.AddComponent("RectComponent", x, y, width, height, 0, 1);
    }
}