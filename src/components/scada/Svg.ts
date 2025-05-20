import { computed } from 'vue'

export default class Svg {
  private _svg: SVGSVGElement

  constructor(
    width: string = '100%',
    height: string = '100%',
    viewBox: string = '0 0 500 500',
  ) {
    this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this._svg.setAttribute('width', width)
    this._svg.setAttribute('height', height)
    this._svg.setAttribute('viewBox', viewBox)
    this._svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    this._svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  }

  get isEmpty() {
    return computed(() => this._svg?.hasChildNodes() === false)
  }

  Get(): SVGSVGElement {
    return this._svg
  }

  Load(svg: string) {
    this.Clear()

    // Parse the SVG string and append it to the SVG element
    const parser = new DOMParser()
    const doc = parser.parseFromString(svg, 'image/svg+xml')
    const svgElement = doc.documentElement
    if (svgElement instanceof SVGSVGElement) {
      this._svg = svgElement
    } else {
      throw new Error('Parsed element is not an SVGSVGElement')
    }
  }

  toString() {
    // Serialize the SVG element to a string
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(this._svg)
    // Return the serialized SVG string
    return svgString
  }

  Save(): string {
    // Serialize the SVG element to a string
    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(this._svg)
    // Return the serialized SVG string
    return svgString
  }

  Clear() {
    // Remove all children
    Array.from(this._svg.children).forEach(child => {
      this._svg.removeChild(child)
    })
    this._svg.innerHTML = ''
    // Optionally, you can also remove any attributes if needed
  }

  AddLayer(name: string): SVGGElement {
    let layer = this.GetLayer(name)
    if (layer) {
      this._svg.removeChild(layer)
    }
    layer = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    layer.setAttribute('id', name)
    this._svg.appendChild(layer)
    return layer
  }
  GetLayer(name: string): SVGGElement | undefined {
    return this._svg.querySelector(`g#${name}`) as SVGGElement | undefined
  }
  RemoveLayer(name: string) {
    const layer = this.GetLayer(name)
    if (layer) {
      this._svg.removeChild(layer)
    }
  }

  getHierarchy(): HTMLCollection {
    return this._svg.children
  }
}
