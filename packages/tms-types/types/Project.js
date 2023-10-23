import { hasIntersection } from "@han-keong/tms-helpers/arrayHelper"
import { parseDate } from "@han-keong/tms-helpers/parseHelper"

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

  static parsers = {
    startDate: parseDate,
    endDate: parseDate,
    createdAt: parseDate,
    updatedAt: parseDate
  }

  /**
   * @param {object} data
   * @param {string} data.App_Acronym
   * @param {number} data.App_Rnumber
   * @param {string?} data.App_permit_Create
   * @param {string?} data.App_permit_Open
   * @param {string?} data.App_permit_toDoList
   * @param {string?} data.App_permit_Doing
   * @param {string?} data.App_permit_Done
   * @param {Date?} data.App_startDate
   * @param {Date?} data.App_endDate
   * @param {string?} data.App_Description
   * @param {number} data.num_plans
   * @param {number} data.num_tasks
   * @param {string} data.created_by
   * @param {Date} data.created_at
   * @param {Date} data.updated_at
   */
  constructor(data) {
    super()
    this.projectName = data.App_Acronym
    this.runningNum = data.App_Rnumber
    this.permit = {
      create: data.App_permit_Create ? data.App_permit_Create.split(",") : [],
      open: data.App_permit_Open ? data.App_permit_Open.split(",") : [],
      todo: data.App_permit_toDoList ? data.App_permit_toDoList.split(",") : [],
      doing: data.App_permit_Doing ? data.App_permit_Doing.split(",") : [],
      done: data.App_permit_Done ? data.App_permit_Done.split(",") : []
    }
    this.startDate = data.App_startDate
    this.endDate = data.App_endDate
    this.description = data.App_Description
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
