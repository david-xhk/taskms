export { default as Group } from "./Group.js"
export { default as User } from "./User.js"
export { default as UserGroup } from "./UserGroup.js"
import Base from "./Base.js"

export function setDatabase(db) {
  Base.db = db
}
