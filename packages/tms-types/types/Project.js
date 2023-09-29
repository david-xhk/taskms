import { hasIntersection } from "@han-keong/tms-helpers/arrayHelper"

import Base from "./Base.js"

export default class Project extends Base {
  /** @readonly @type {string} */
  projectName

  /** @readonly @type {number} */
  runningNum

  /** @readonly @type {{ [key in import("./ProjectPermit.js").default["permit"]]: string[] }} */
  permit

  /** @readonly @type {Date?} */
  startDate

  /** @readonly @type {Date?} */
  endDate

  /** @readonly @type {string?} */
  description

  /** @readonly @type {number} */
  numPlans

  /** @readonly @type {number} */
  numTasks

  /** @readonly @type {string} */
  createdBy

  /** @readonly @type {Date} */
  createdAt

  /** @readonly @type {Date} */
  updatedAt

  /**
   * @param {object} data
   * @param {string} data.project_name
   * @param {number} data.running_num
   * @param {string?} data.permit_create
   * @param {string?} data.permit_open
   * @param {string?} data.permit_todo
   * @param {string?} data.permit_doing
   * @param {string?} data.permit_done
   * @param {Date?} data.start_date
   * @param {Date?} data.end_date
   * @param {string?} data.description
   * @param {number} data.num_plans
   * @param {number} data.num_tasks
   * @param {string} data.created_by
   * @param {Date} data.created_at
   * @param {Date} data.updated_at
   */
  constructor(data) {
    super()
    this.projectName = data.project_name
    this.runningNum = data.running_num
    this.permit = {
      create: data.permit_create ? data.permit_create.split(",") : [],
      open: data.permit_open ? data.permit_open.split(",") : [],
      todo: data.permit_todo ? data.permit_todo.split(",") : [],
      doing: data.permit_doing ? data.permit_doing.split(",") : [],
      done: data.permit_done ? data.permit_done.split(",") : []
    }
    this.startDate = data.start_date
    this.endDate = data.end_date
    this.description = data.description
    this.numPlans = data.num_plans
    this.numTasks = data.num_tasks
    this.createdBy = data.created_by
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  /**
   * @param {keyof Project["permit"]} permit
   * @param {string[]} groups
   */
  isInPermitGroup(permit, groups) {
    return hasIntersection(this.permit[permit], groups)
  }

  /**
   * @param {string[]} groups
   */
  isInPermitCreate(groups) {
    return this.isInPermitGroup("create", groups)
  }

  /**
   * @param {string[]} groups
   */
  isInPermitOpen(groups) {
    return this.isInPermitGroup("open", groups)
  }

  /**
   * @param {string[]} groups
   */
  isInPermitTodo(groups) {
    return this.isInPermitGroup("todo", groups)
  }

  /**
   * @param {string[]} groups
   */
  isInPermitDoing(groups) {
    return this.isInPermitGroup("doing", groups)
  }

  /**
   * @param {string[]} groups
   */
  isInPermitDone(groups) {
    return this.isInPermitGroup("done", groups)
  }
}
