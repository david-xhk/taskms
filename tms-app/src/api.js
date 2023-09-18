import axios from "axios"
axios.defaults.baseURL = process.env.API_BASE_URL || ""
axios.defaults.withCredentials = true

const endpoint = (method, url) => {
  return function wrappedAsyncCallback(...args) {
    let callback, value
    switch (args.length) {
      case 1:
        callback = args[0]
        break
      case 2:
        value = args[0]
        callback = args[1]
        break
      default:
        callback = function noOp() {}
        break
    }
    const params = []
    if (typeof url === "function") {
      params.push(url(value?.params))
    } else {
      params.push(url)
    }
    if (value?.data !== undefined) {
      params.push(value.data)
    }
    const abortController = new AbortController()
    setTimeout(() => abortController.abort(), 5000)
    axios[method](...params, { signal: abortController.signal })
      .then(response => callback(response))
      .catch(error => {
        if (error.response) {
          callback(error.response)
        } else {
          console.log(error)
        }
      })
    return () => abortController.abort()
  }
}

export default class API {
  static register = endpoint("post", "/api/auth/register")

  static login = endpoint("post", "/api/auth/login")

  static logout = endpoint("get", "/api/auth/logout")

  static getCurrentUser = endpoint("get", "/api/user")

  static getUser = endpoint("get", username => `/api/user/${username}`)

  static putUser = endpoint("put", username => `/api/user/${username}`)

  static getUsers = endpoint("get", "/api/users")

  static postUser = endpoint("post", "/api/users")

  static getGroups = endpoint("get", "/api/groups")

  static postGroups = endpoint("post", "/api/groups")
}
