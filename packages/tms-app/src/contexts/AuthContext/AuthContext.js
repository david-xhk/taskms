import { createContext } from "react"

/**
 * @typedef {import("@han-keong/tms-types/User").default} User
 * @typedef {import("src/api").EndpointCallbacks} EndpointCallbacks
 */

/**
 * @template {string} K
 * @template V
 * @template {boolean} N
 * @typedef {ReturnType<typeof import("src/hooks/formHooks/useFormInput").default<K, V, N>>} FormInput
 */

/**
 * @template T
 * @typedef {import("src/hooks/apiHooks/useApi").EndpointFunction<T>} EndpointFunction
 */

/**
 * @typedef {object} Auth
 * @property {User?} currentUser
 * @property {boolean} isLoggedIn
 * @property {boolean} isChecked
 * @property {boolean} isAdmin
 * @property {boolean} isProjectLead
 * @property {boolean} isProjectManager
 * @property {FormInput<"username", string, false>} username
 * @property {FormInput<"password", string, false>} password
 * @property {EndpointFunction<boolean>} login
 * @property {EndpointFunction<boolean>} logout
 * @property {EndpointFunction<User?>} checkUser
 * @property {EndpointFunction<boolean>} checkAdmin
 * @property {EndpointFunction<boolean>} checkProjectLead
 * @property {EndpointFunction<boolean>} checkProjectManager
 * @property {(group: string, args?: Parameters<EndpointFunction<boolean>>[0]) => ReturnType<EndpointFunction<boolean>>} checkGroup
 * @property {(groups: string[], args?: Parameters<EndpointFunction<boolean>>[0]) => ReturnType<EndpointFunction<boolean>>} checkGroups
 *
 */

const AuthContext = createContext(
  /** @type {Auth} */ ({
    currentUser: null,
    isLoggedIn: false,
    isChecked: false,
    isAdmin: false,
    isProjectLead: false,
    isProjectManager: false,
    username: { key: "username", value: "", dirty: false, error: null, invalid: false, required: true, nullable: false, valid: null, validating: false, onChange: () => {}, reset: () => {}, validate: () => false },
    password: { key: "password", value: "", dirty: false, error: null, invalid: false, required: true, nullable: false, valid: null, validating: false, onChange: () => {}, reset: () => {}, validate: () => false },
    login: () => Promise.resolve(false),
    logout: () => Promise.resolve(false),
    checkUser: () => Promise.resolve(null),
    checkAdmin: () => Promise.resolve(false),
    checkProjectLead: () => Promise.resolve(false),
    checkProjectManager: () => Promise.resolve(false),
    checkGroup: () => Promise.resolve(false),
    checkGroups: () => Promise.resolve(false)
  })
)

export default AuthContext
