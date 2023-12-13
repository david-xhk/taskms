import axios from "axios"

import config from "src/config"

axios.defaults.baseURL = config.API_BASE_URL
axios.defaults.withCredentials = true

/**
 * @typedef EndpointCallbacks
 * @property {() => any | Promise<any>} [onStart]
 * @property {(data?: any) => any | Promise<any>} [onSuccess]
 * @property {(res: import("axios").AxiosResponse) => any | Promise<any>} [onError]
 * @property {() => any | Promise<any>} [onFinally]
 */

/**
 * @callback Endpoint
 * @param {object} [args]
 * @param {any} [args.urlParams]
 * @param {any} [args.queryParams]
 * @param {any} [args.data]
 * @param {EndpointCallbacks | (EndpointCallbacks | undefined)[]} [args.callbacks]
 * @returns {(message: string) => void}
 */

/**
 * @param {"get" | "post" | "put" | "patch" | "delete" | "head" | "options"} method
 * @param {string | ((urlParams: any) => string)} url
 * @returns {Endpoint}
 */
export function endpoint(method, url) {
  return function inner(args) {
    const { urlParams, queryParams, data, callbacks } = args ?? {}
    const { onStart, onSuccess, onError, onFinally } = curryCallbacks(...(Array.isArray(callbacks) ? callbacks : [callbacks]))
    const path = typeof url === "function" ? url(urlParams) : url
    const abortController = new AbortController()
    const options = { signal: abortController.signal }
    if (queryParams !== undefined) {
      options.params = queryParams
    }
    if (onStart) {
      onStart()
    }
    let request
    if (method === "post" || method === "put" || method === "patch") {
      request = axios[method](path, data, options)
    } else {
      request = axios[method](path, options)
    }
    request
      .then(res => {
        if (res.data?.success) {
          if (onSuccess) {
            onSuccess(res)
          }
        } else if (onError) {
          onError(res)
        }
      })
      .catch(err => {
        if (config.NODE_ENV === "development") {
          console.error(err)
        }
        if (onError && err.response) {
          onError(err.response)
        }
      })
      .finally(() => {
        if (onFinally) {
          onFinally()
        }
      })
    setTimeout(() => abortController.abort("timeout"), config.API_TIMEOUT_MS)
    return message => abortController.abort(message)
  }
}

/**
 * @param {(EndpointCallbacks | undefined)[]} callbacks
 * @returns {EndpointCallbacks}
 */
export function curryCallbacks(...callbacks) {
  const callbackMap = /** @type {{ [K in keyof EndpointCallbacks]: NonNullable<EndpointCallbacks[K]>[] }} */ ({})
  for (let key of ["onStart", "onSuccess", "onError", "onFinally"]) {
    for (let _callbacks of callbacks) {
      if (_callbacks && typeof _callbacks === "object" && _callbacks[key] !== undefined) {
        if (!(key in callbackMap)) {
          callbackMap[key] = []
        }
        callbackMap[key].push(_callbacks[key])
      }
    }
  }
  const curriedCallbacks = /** @type {EndpointCallbacks} */ ({})
  for (let [key, callbacks] of Object.entries(callbackMap)) {
    curriedCallbacks[key] = async arg => {
      let curr = arg
      for (let callback of callbacks) {
        curr = (await callback(curr)) ?? curr
      }
      return curr
    }
  }
  return curriedCallbacks
}

export default class API {
  // Auth API
  static login = endpoint("post", "/api/auth/login")

  static logout = endpoint("get", "/api/auth/logout")

  // Administrator features
  static postGroups = endpoint("post", "/api/groups")

  static getUsers = endpoint("get", "/api/users")

  static postUsers = endpoint("post", "/api/users")

  static getUser = endpoint("get", username => `/api/user/${username}`)

  static patchUser = endpoint("patch", username => `/api/user/${username}`)

  // Project Lead features
  static postProjects = endpoint("post", "/api/projects")

  static patchProject = endpoint("patch", project => `/api/project/${project}`)

  // Project Manager features
  static postProjectPlans = endpoint("post", project => `/api/project/${project}/plans`)

  static patchProjectPlan = endpoint("patch", ([project, plan]) => `/api/project/${project}/plan/${plan}`)

  // User features
  static getGroups = endpoint("get", "/api/groups")

  static getProjects = endpoint("get", "/api/projects")

  static getProject = endpoint("get", project => `/api/project/${project}`)

  static getProjectPlans = endpoint("get", project => `/api/project/${project}/plans`)

  static getProjectPlan = endpoint("get", ([project, plan]) => `/api/project/${project}/plan/${plan}`)

  static getProjectTasks = endpoint("get", project => `/api/project/${project}/tasks`)

  static postProjectTasks = endpoint("post", project => `/api/project/${project}/tasks`)

  static getProjectTask = endpoint("get", taskId => `/api/project/${taskId.split("_")[0]}/task/${taskId.split("_")[1]}`)

  static patchProjectTask = endpoint("patch", taskId => `/api/project/${taskId.split("_")[0]}/task/${taskId.split("_")[1]}`)

  static getProjectTaskNotes = endpoint("get", taskId => `/api/project/${taskId.split("_")[0]}/task/${taskId.split("_")[1]}/notes`)

  static postProjectTaskNotes = endpoint("post", taskId => `/api/project/${taskId.split("_")[0]}/task/${taskId.split("_")[1]}/notes`)

  static getProjectTaskNote = endpoint("get", noteId => `/api/project/${noteId.split("_")[0]}/task/${noteId.split("_")[1]}/note/${noteId.split("_")[2]}`)

  static getCurrentUser = endpoint("get", "/api/user")

  static patchCurrentUser = endpoint("patch", "/api/user")
}
