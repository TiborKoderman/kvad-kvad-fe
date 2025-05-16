export default class Svg {
    private svg: SVGSVGElement;

    private layers: Map<string, SVGGElement> = new Map();

    constructor(width: string, height: string, viewBox: string) {
        // Create an SVG element using the SVG 2 standard
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', width);
        this.svg.setAttribute('height', height);
        this.svg.setAttribute('viewBox', viewBox);
        this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        this.svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink'); // SVG 2 compatibility
    }

    Init() {
        console.log('Scada component initialized');
    }

    AddLayer(name: string): SVGGElement {
        const layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        layer.setAttribute('id', name);
        this.svg.appendChild(layer);
        this.layers.set(name, layer);
        return layer;
    }
    GetLayer(name: string): SVGGElement | undefined {
        return this.layers.get(name);
    }
    RemoveLayer(name: string) {
        const layer = this.layers.get(name);
        if (layer) {
            this.svg.removeChild(layer);
            this.layers.delete(name);
        }
    }

    Get(): SVGSVGElement {
        return this.svg;
    }
}