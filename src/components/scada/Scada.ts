import SObject from './SObject'
import Svg from './Svg'
import './ComponentRegistry'
import.meta.glob('./Components/*.ts', { eager: true })
// import defaultCursor from './Cursors/scadaCursor.png'
import { deepMerge } from './utils'

interface ScadaOptions {
  width: string
  height: string
  viewBox: string
  autoresize: boolean
  backgroundColor: string
  border: string
}

export default class Scada {
  public svg: Svg

  private _sObjects: SObject[] = []


  private _options: ScadaOptions = {
    width: '100%',
    height: '100%',
    viewBox: '0 0 1600 900',
    autoresize: true,
    backgroundColor: '#FFFFFF00',
    border: '1px solid gray',
  }

  constructor(options: Partial<ScadaOptions> = {}) {
    this._options = deepMerge(this._options, options)
    this.svg = new Svg(
      {
        width: this._options.width,
        height: this._options.height,
        viewBox: this._options.viewBox,
        autoresize: this._options.autoresize,
        backgroundColor: this._options.backgroundColor,
        border: this._options.border,
      }
    )

    this.svg.svg.setAttribute('style', 'border: 1px solid black;')
    this.svg.svg.setAttribute('cursor', `crosshair`)
    this.svg.AddLayer('background')
    this.svg.AddLayer('objects')
    this.svg.AddLayer('annotations')
    this.svg
      .GetLayer('background')
      ?.setAttribute(
        'style',
        `background-color: ${this._options.backgroundColor};`,
      )
    return this
  }

  init() {
    this._sObjects.forEach(object => {
      object.Mount(this)
    })
    console.log('Scada initialized')
  }

  Update() {
    this._sObjects.forEach(object => {
      object.Update()
    })
  }
  Render() {
    this._sObjects.forEach(object => {
      object.Render()
    })
  }

  AddObject(object: SObject) {
    this._sObjects.push(object)
    object.Mount(this)
  }
  RemoveObject(object: SObject) {
    const index = this._sObjects.indexOf(object)
    if (index > -1) {
      this._sObjects.splice(index, 1)
    }
  }
}
