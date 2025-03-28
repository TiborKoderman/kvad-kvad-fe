export default class Vector {
  values: number[]

  constructor(...values) {
    this.values = values
  }

  normalize() {
    const magnitude = this.magnitude()
    return new Vector(...this.values.map(value => value / magnitude))
  }

  magnitude() {
    return Math.sqrt(this.values.reduce((acc, value) => acc + value ** 2, 0))
  }

  add(vector: Vector) {
    return new Vector(
      ...this.values.map((value, index) => value + vector.values[index]),
    )
  }

  subtract(vector: Vector) {
    return new Vector(
      ...this.values.map((value, index) => value - vector.values[index]),
    )
  }

  multiply(scalar: number) {
    return new Vector(...this.values.map(value => value * scalar))
  }

  divide(scalar: number) {
    return new Vector(...this.values.map(value => value / scalar))
  }

  dot(vector: Vector) {
    return this.values.reduce(
      (acc, value, index) => acc + value * vector.values[index],
      0,
    )
  }

  cross(vector: Vector) {
    if (this.values.length !== 3 || vector.values.length !== 3) {
      throw new Error(
        'Cross product is only defined for 3-dimensional vectors.',
      )
    }
    return new Vector(
      this.values[1] * vector.values[2] - this.values[2] * vector.values[1],
      this.values[2] * vector.values[0] - this.values[0] * vector.values[2],
      this.values[0] * vector.values[1] - this.values[1] * vector.values[0],
    )
  }

  angle(vector: Vector, radians = true) {
    if (!radians) {
      return this.angle(vector, true) * (180 / Math.PI)
    }
    return Math.acos(this.dot(vector) / (this.magnitude() * vector.magnitude()))
  }

  project(vector: Vector) {
    return vector.normalize().multiply(this.dot(vector.normalize()))
  }

  reject(vector: Vector) {
    return this.subtract(this.project(vector))
  }

  toString() {
    return `Vector(${this.values.join(', ')})`
  }

  getPolar() {
    if (this.values.length !== 2) {
      throw new Error('Polar coordinates are only defined for 2-dimensional vectors.')
    }
    return {
      radius: this.magnitude(),
      angle: Math.atan2(this.values[1], this.values[0]),
    }
  }

  static fromAngle(angle: number) {
    return new Vector(Math.cos(angle), Math.sin(angle))
  }
}
