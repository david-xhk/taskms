/**
 * @template {(...args: any[]) => any} F
 * @template {string} K
 * @typedef {(...args: Parameters<F>) => Chain<F, K>} ChainFunction
 */

/**
 * @template {(...args: any[]) => any} F
 * @template {string} K
 * @typedef {{ [k in K]: ChainFunction<F, K> }} Chain
 */

/**
 * @template {(...args: any[]) => any} F
 * @template {string} K
 * @param {F} func
 * @param {K} key
 * @returns {Chain<F, K>}
 */
export function chain(func, key) {
  return /** @type {Chain<F, K>} */ ({ [key]: /** @type {ChainFunction<F, K>} */ ((...args) => chainFunction(func, key)(...args)) })
}

/**
 * @template {(...args: any[]) => any} F
 * @template {string} K
 * @param {F} func
 * @param {K} key
 * @returns {ChainFunction<F, K>}
 */
export function chainFunction(func, key) {
  /** @type {ChainFunction<F, K>} */
  return (...args) => {
    func(...args)
    return chain(func, key)
  }
}
