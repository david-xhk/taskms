export default class Base {
  /**
   * @template {{ prototype: any }} T
   * @this {T}
   * @param {{[K in keyof T["prototype"] as T["prototype"][K] extends Function ? never : K]: T["prototype"][K]}} data
   * @returns {T["prototype"]}
   */
  static create(data) {
    const obj = Object.create(this.prototype)
    Object.assign(obj, data)
    return obj
  }
}
