import { computed } from 'vue';

export default class Svg {
    private svg: SVGSVGElement;

    constructor(width: string = '100%', height: string = '100%', viewBox: string = '0 0 500 500') {
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', width);
        this.svg.setAttribute('height', height);
        this.svg.setAttribute('viewBox', viewBox);
        this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        this.svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    }

    isEmpty(): boolean {
        // Returns true if the SVG element has no child elements.
        return this.svg.children.length === 0;
    }

    public isEmptyComputed = computed(() => {
        // Returns true if the SVG element has no child elements.
        return this.svg.children.length === 0;
    }
    );


    Get(): SVGSVGElement {
        return this.svg;
    }

    Load(svg: string) {
        this.Clear();

        // Parse the SVG string and append it to the SVG element
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const svgElement = doc.documentElement;
        if (svgElement instanceof SVGSVGElement) {
            this.svg = svgElement;
        } else {
            throw new Error('Parsed element is not an SVGSVGElement');
        }
    }

    toString() {
        // Serialize the SVG element to a string
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(this.svg);
        // Return the serialized SVG string
        return svgString;
    }

    Save(): string {
        // Serialize the SVG element to a string
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(this.svg);
        // Return the serialized SVG string
        return svgString;
    }

    Clear() {
        // Remove all children
        this.svg.innerHTML = '';
        // Optionally, you can also remove any attributes if needed
        
    }


    AddLayer(name: string): SVGGElement {
        let layer = this.GetLayer(name);
        if (layer) {
            this.svg.removeChild(layer);
        }
        layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        layer.setAttribute('id', name);
        this.svg.appendChild(layer);
        return layer;
    }
    GetLayer(name: string): SVGGElement | undefined {
        return this.svg.querySelector(`g#${name}`) as SVGGElement | undefined;
    }
    RemoveLayer(name: string) {
        const layer = this.GetLayer(name);
        if (layer) {
            this.svg.removeChild(layer);
        }
    }

    getHierarchy(): HieNode[] {
    function traverse(element: Element): HieNode {
        const children: Element[] = Array.from(element.children);
        
        return {
        id: element.id,
        name: element.getAttribute("inkscape:label") || element.id || element.tagName, // or any label attribute
        tagName: element.tagName,
        children: children.map(traverse),
        selected: element.classList.contains("selected") // Check if the element has the "selected" class
        };
    }

    // Start from top-level children
    return Array.from(this.svg.children).map(traverse);
    }

}

export interface HieNode {
    id: string
    name: string
    tagName: string
    children: HieNode[]
    selected: boolean
}