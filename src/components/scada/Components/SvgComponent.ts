import Component from './Component'
import SObject from '../SObject'
import ComponentRegistry from '../ComponentRegistry'
import RectComponent from './RectComponent'

@ComponentRegistry.Register('SvgComponent')
export default class SvgComponent extends Component {
    rectComponent!: RectComponent
    private _svgElement: SVGElement | null = null

    constructor(sObject: SObject, svgString?: string) {
        super(sObject)
        if (svgString && svgString.trim() !== '') {
            const parser = new DOMParser()
            console.log('SVG String:', svgString)
            const doc = parser.parseFromString(svgString, 'image/svg+xml')
            const svgElem = doc.documentElement as unknown as SVGElement
            this._svgElement = svgElem
            ComponentRegistry.autowire(this, ['RectComponent'])

            // Compute bounding box and set rectComponent
            const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            tempSvg.style.visibility = 'hidden'
            tempSvg.style.position = 'absolute'
            tempSvg.style.width = '0'
            tempSvg.style.height = '0'
            document.body.appendChild(tempSvg)
            let bbox
            try {
                const imported = document.importNode(svgElem, true) as SVGElement
                tempSvg.appendChild(imported)
                bbox = (imported as SVGGraphicsElement).getBBox()
                tempSvg.removeChild(imported)
            } catch {
                bbox = { x: 0, y: 0, width: 0, height: 0 }
            }
            document.body.removeChild(tempSvg)
            this.rectComponent = new RectComponent(sObject, bbox.x, bbox.y, bbox.width, bbox.height)
        } else {
            // Initialize rectComponent with default values if no SVG string
            this.rectComponent = new RectComponent(sObject, 0, 0, 0, 0)
        }
    }

    Mount() {
        if (this._svgElement) {
            if (this._svgElement.tagName.toLowerCase() === 'svg') {
                this._svgElement.setAttribute('width', '100%')
                this._svgElement.setAttribute('height', '100%')
                this._svgElement.setAttribute('viewBox', '0 0 100 100')
                this._svgElement.setAttribute('preserveAspectRatio', 'xMinYMin meet')
            }
            this.sObject.scada.svg.GetLayer('objects')?.appendChild(this._svgElement)
        }
    }
    Update() {}
    Render() {}
}
