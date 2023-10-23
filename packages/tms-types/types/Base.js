export default class Base extends Object {
  /** @type {{ [key: string]: Function } }} */
  static parsers

  /**
   * @template {{ new (...args: any[]): any, prototype: any, parsers?: { [key: string]: Function } }} T
   * @this {T}
   * @param {{[K in keyof T["prototype"] as T["prototype"][K] extends Function ? never : K]: T["prototype"][K]}} data
   * @returns {InstanceType<T>}
   */
  static create(data) {
    const obj = /** @type {InstanceType<T>} */ (Object.create(this.prototype))
    Object.assign(obj, data)
    if (this.parsers !== undefined) {
      for (let key in obj) {
        if (obj[key] !== undefined && obj[key] !== null && key in this.parsers) {
          obj[key] = this.parsers[key](obj[key])
        }
      }
    }
    return obj
  }
}
