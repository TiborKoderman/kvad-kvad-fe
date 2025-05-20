export default class Svg {
  private _svg: SVGSVGElement

  private width: string = '100%'
  private height: string = '100%'
  private viewBox: string = '0 0 500 500'

  private highlight: string = 'highlight'

  private selectMode = false;
  private _onElementClick: ((el: SVGElement) => void) | null = null;
  private _onElementHover: ((el: SVGElement | null) => void) | null = null;

  constructor(
    width: string = '100%',
    height: string = '100%',
    viewBox: string = '0 0 500 500',
  ) {
    this.width = width
    this.height = height
    this.viewBox = viewBox
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
    this._svg.setAttribute('width', this.width)
    this._svg.setAttribute('height', this.height)
    this._svg.setAttribute('viewBox', this.viewBox)
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

  enableSelectMode(
    onSelect?: (el: SVGElement) => void,
    onHover?: (el: SVGElement | null) => void
  ) {
    this.selectMode = true;
    this._onElementClick = onSelect || null;
    this._onElementHover = onHover || null;

    // Attach listeners to all SVG elements except <svg>
    this._addListenersToChildren(this._svg);
  }

  disableSelectMode() {
    this.selectMode = false;
    this._onElementClick = null;
    this._onElementHover = null;
    this._removeListenersFromChildren(this._svg);
    this._removeHighlight();
  }

  private _addListenersToChildren(parent: SVGElement) {
    Array.from(parent.children).forEach(child => {
      child.addEventListener('click', this._handleElementClick, true);
      child.addEventListener('mouseenter', this._handleElementHover, true);
      child.addEventListener('mouseleave', this._handleElementUnhover, true);
      // Recursively add to children
      if (child instanceof SVGElement) {
        this._addListenersToChildren(child);
      }
    });
  }

  private _removeListenersFromChildren(parent: SVGElement) {
    Array.from(parent.children).forEach(child => {
      child.removeEventListener('click', this._handleElementClick, true);
      child.removeEventListener('mouseenter', this._handleElementHover, true);
      child.removeEventListener('mouseleave', this._handleElementUnhover, true);
      if (child instanceof SVGElement) {
        this._removeListenersFromChildren(child);
      }
    });
  }

  private _handleElementClick = (e: Event) => {
    if (!this.selectMode) return;
    e.stopPropagation();
    if (this._onElementClick && e.currentTarget instanceof SVGElement) {
      this._onElementClick(e.currentTarget);
    }
  };

  private _handleElementHover = (e: Event) => {
    if (!this.selectMode) return;
    e.stopPropagation();
    if (e.currentTarget instanceof SVGElement) {
      this._highlightElement(e.currentTarget);
      if (this._onElementHover) this._onElementHover(e.currentTarget);
    }
  };

  private _handleElementUnhover = (e: Event) => {
    if (!this.selectMode) return;
    e.stopPropagation();
    this._removeHighlight();
    if (this._onElementHover) this._onElementHover(null);
  };

  private _highlightRect: SVGRectElement | null = null;

  private _highlightElement(el: SVGElement) {
    this._removeHighlight();
    if (typeof (el as any).getBBox === 'function') {
      const bbox = (el as any).getBBox();
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(bbox.x));
      rect.setAttribute('y', String(bbox.y));
      rect.setAttribute('width', String(bbox.width));
      rect.setAttribute('height', String(bbox.height));
      rect.setAttribute('fill', 'none');
      rect.setAttribute('stroke', '#007bff');
      rect.setAttribute('stroke-width', '2');
      rect.setAttribute('pointer-events', 'none');
      rect.setAttribute('data-svg-highlight', 'true');
      el.parentNode?.insertBefore(rect, el.nextSibling);
      this._highlightRect = rect;
    }
  }

  private _removeHighlight() {
    if (this._highlightRect && this._highlightRect.parentNode) {
      this._highlightRect.parentNode.removeChild(this._highlightRect);
      this._highlightRect = null;
    }
  }

}
