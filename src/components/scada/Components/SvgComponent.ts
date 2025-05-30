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
            // Create a group to contain both the rect and SVG
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
            group.setAttribute('id', this.sObject.id)
            
            // Mount the rect component first (background/bounds)
            this.rectComponent.Mount()
            
            // Move the rect element to our group
            const rectElement = this.sObject.scada.svg.GetLayer('objects')?.querySelector(`#${this.sObject.id}_rect`)
            if (rectElement) {
                group.appendChild(rectElement)
            }
            
            if (this._svgElement.tagName.toLowerCase() === 'svg') {
                // For SVG elements, position at rect coordinates and scale to fit
                this._svgElement.setAttribute('x', this.rectComponent.x.toString())
                this._svgElement.setAttribute('y', this.rectComponent.y.toString()) 
                this._svgElement.setAttribute('width', this.rectComponent.width.toString())
                this._svgElement.setAttribute('height', this.rectComponent.height.toString())
                this._svgElement.setAttribute('preserveAspectRatio', 'none')
                group.appendChild(this._svgElement)
            } else {
                // For other elements, wrap and position at rect coordinates
                const svgWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                svgWrapper.setAttribute('x', this.rectComponent.x.toString())
                svgWrapper.setAttribute('y', this.rectComponent.y.toString())
                svgWrapper.setAttribute('width', this.rectComponent.width.toString())
                svgWrapper.setAttribute('height', this.rectComponent.height.toString())
                svgWrapper.appendChild(this._svgElement)
                group.appendChild(svgWrapper)
            }
            
            // Add group to the objects layer (no transform needed)
            this.sObject.scada.svg.GetLayer('objects')?.appendChild(group)
        }
    }
    Update() {}
    Render() {}
}
