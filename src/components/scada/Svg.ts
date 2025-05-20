export default class Svg {
  private _svg: SVGSVGElement

  private _width: string = '100%'
  private _height: string = '100%'
  private _viewBox: string = '0 0 500 500'

  private _selected: SVGElement[] = []
  private _lastSelectedIndex: number = -1

  private _draggable = false

  constructor(
    width: string = '100%',
    height: string = '100%',
    viewBox: string = '0 0 500 500',
  ) {
    this._width = width
    this._height = height
    this._viewBox = viewBox
    this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this._svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    this._svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    this._svg.setAttribute('width', width)
    this._svg.setAttribute('height', height)
    this._svg.setAttribute('viewBox', viewBox)
  }

  get isEmpty() {
    return this._svg?.hasChildNodes() === false
  }

  get svg(): SVGSVGElement {
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
    this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this._svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    this._svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    this._svg.setAttribute('width', this._width)
    this._svg.setAttribute('height', this._height)
    this._svg.setAttribute('viewBox', this._viewBox)
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

  isSelected(element: SVGElement): boolean {
    return this._selected.includes(element)
  }

  get selected(): SVGElement[] {
    return this._selected
  }

  get filteredNodes() {
    return Array.from(this._svg.children)
      .filter(
        (node): node is SVGElement =>
          node instanceof SVGElement && node.tagName === 'g',
      )
      .reverse()
  }

  get flatNodes() {
    const nodes: SVGElement[] = []
    function traverse(node: Element) {
      nodes.push(node as SVGElement)
      if (node.children) {
        Array.from(node.children).reverse().forEach(traverse)
      }
    }
    this.filteredNodes.forEach(traverse)
    return nodes
  }

  toggleSelect(event: MouseEvent, node: SVGElement) {
    const ctrl = event.ctrlKey || event.metaKey
    const shift = event.shiftKey

    const nodes = this.flatNodes
    const idx = nodes.indexOf(node)

    if (shift && this._lastSelectedIndex !== -1 && nodes.length > 0) {
      // Select range between lastSelectedIndex and current idx
      const start = Math.min(this._lastSelectedIndex, idx)
      const end = Math.max(this._lastSelectedIndex, idx)
      const range = nodes.slice(start, end + 1)
      this._selected = range
    } else if (ctrl) {
      // Toggle selection for this node
      if (this._selected.includes(node)) {
        this._selected = this._selected.filter(n => n !== node)
      } else {
        this._selected = [...this._selected, node]
      }
      this._lastSelectedIndex = idx
    } else {
      // Only select this node
      this._selected = [node]
      this._lastSelectedIndex = idx
    }
  }

  getNode(node: SVGElement): SVGElement {
    return node
  }

  setClickToSelect() {
    this._svg.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as SVGElement
      console.log('target', target)
      if (target ) {
        this.toggleSelect(event, target)
      }
    })
    // Add hover effect to highlight hovered element
    this._svg.addEventListener('mouseover', (event: MouseEvent) => {
      const target = event.target as SVGElement
      if (target && target !== this._svg) {
        target.setAttribute('data-svg-hover', 'true')
        target.style.filter = 'brightness(0.85)'
      }
    })
    this._svg.addEventListener('mouseout', (event: MouseEvent) => {
      const target = event.target as SVGElement
      if (target && target !== this._svg) {
        target.removeAttribute('data-svg-hover')
        target.style.filter = ''
      }
    })
  }

  setDraggable(enabled: boolean) {
    this._draggable = enabled

    // Remove previous listeners if any
    this._svg.onmousedown = null
    this._svg.onmousemove = null
    this._svg.onmouseup = null
    this._svg.onmouseleave = null

    if (!enabled) return

    let draggingEl: SVGElement | null = null
    let startX = 0
    let startY = 0
    let origX = 0
    let origY = 0

    this._svg.onmousedown = (event: MouseEvent) => {
      if (!this._draggable) return
      const target = event.target as SVGElement
      if (target && target !== this._svg) {
        draggingEl = target
        const pt = this._svg.createSVGPoint()
        pt.x = event.clientX
        pt.y = event.clientY
        const svgP = pt.matrixTransform(this._svg.getScreenCTM()?.inverse())
        startX = svgP.x
        startY = svgP.y

        // Get current transform
        const transform = draggingEl.getAttribute('transform')
        const match = transform && /translate\(([-\d.]+)[ ,]([-\d.]+)\)/.exec(transform)
        origX = match ? parseFloat(match[1]) : 0
        origY = match ? parseFloat(match[2]) : 0

        event.preventDefault()
      }
    }

    this._svg.onmousemove = (event: MouseEvent) => {
      if (!this._draggable || !draggingEl) return
      const pt = this._svg.createSVGPoint()
      pt.x = event.clientX
      pt.y = event.clientY
      const svgP = pt.matrixTransform(this._svg.getScreenCTM()?.inverse())
      const dx = svgP.x - startX
      const dy = svgP.y - startY
      draggingEl.setAttribute('transform', `translate(${origX + dx}, ${origY + dy})`)
    }

    const stopDrag = () => {
      draggingEl = null
    }

    this._svg.onmouseup = stopDrag
    this._svg.onmouseleave = stopDrag
  }

}
