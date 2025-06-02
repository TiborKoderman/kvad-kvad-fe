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
            // Create a group to contain both the rect and SVG content
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
            group.setAttribute('id', this.sObject.id)
            
            // Mount the rect component first (background/bounds)
            this.rectComponent.Mount()
            
            // Move the rect element to our group
            const rectElement = this.sObject.scada.svg.GetLayer('objects')?.querySelector(`#${this.sObject.id}_rect`)
            if (rectElement) {
                group.appendChild(rectElement)
            }
            
            // Create a group for SVG content
            const svgContentGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
            
            // Extract all children from the SVG element
            const children = Array.from(this._svgElement.children)
            children.forEach(child => {
                const importedChild = document.importNode(child, true)
                svgContentGroup.appendChild(importedChild)
            })
            
            // Position and scale the content group to fit the rect
            const rectAttrs = this.rectComponent.GetRect()
            const x = rectAttrs.getAttribute('x') || '0'
            const y = rectAttrs.getAttribute('y') || '0'
            const width = rectAttrs.getAttribute('width') || '0'
            const height = rectAttrs.getAttribute('height') || '0'
            
            // Get original SVG viewBox or dimensions for scaling
            const viewBox = this._svgElement.getAttribute('viewBox')
            let originalWidth, originalHeight
            
            if (viewBox) {
                const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number)
                originalWidth = vbWidth
                originalHeight = vbHeight
            } else {
                originalWidth = parseFloat(this._svgElement.getAttribute('width') || '100')
                originalHeight = parseFloat(this._svgElement.getAttribute('height') || '100')
            }
            
            // Calculate scale and apply transform
            const scaleX = parseFloat(width) / originalWidth
            const scaleY = parseFloat(height) / originalHeight
            const transform = `translate(${x}, ${y}) scale(${scaleX}, ${scaleY})`
            svgContentGroup.setAttribute('transform', transform)
            
            group.appendChild(svgContentGroup)
            
            // Add group to the objects layer
            this.sObject.scada.svg.GetLayer('objects')?.appendChild(group)
        }
    }
    Update() {}
    Render() {}
}
