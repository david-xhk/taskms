import ProjectModel from "@han-keong/tms-models/ProjectModel"
import { composeAll, composeAny, containsAlphabetsDigitsOrDashesOnly, containsAlphabetsDigitsSpecialOrSpacesOnly, createAsyncValidator, isDateString, isEither, isHexColourString, isInteger, isIntegerString, isNonEmptyString, isProvided, isString, moreThan, notLessThan, notLongerThan } from "@han-keong/tms-validators"

export const validateProject = composeAll([isProvided, isNonEmptyString, notLongerThan(32), containsAlphabetsDigitsOrDashesOnly], { key: "project" })

export const validateRunningNum = composeAll([isProvided, composeAny([isInteger, isIntegerString]), notLessThan(0)], { key: "runningNum" })

export const validateDate = composeAll([isProvided, isDateString], { key: "date" })

export const validateDescription = composeAll([isProvided, isNonEmptyString], { key: "description" })

export const validatePlan = composeAll([isProvided, isNonEmptyString, notLongerThan(32), containsAlphabetsDigitsSpecialOrSpacesOnly], { key: "plan" })

export const validateColour = composeAll([isProvided, isHexColourString], { key: "colour" })

export const validateTask = composeAll([isProvided, isNonEmptyString, notLongerThan(32), containsAlphabetsDigitsSpecialOrSpacesOnly], { key: "task" })

export const validateTaskNum = composeAll([isProvided, isIntegerString, moreThan(0)], { key: "taskNum" })

export const validateTaskState = composeAll([isProvided, isString, isEither("open", "todo", "doing", "done", "closed")], { key: "state" })

export const validateNoteContent = composeAll([isProvided, isNonEmptyString], { key: "content" })

export const validateNoteNum = composeAll([isProvided, isIntegerString, moreThan(0)], { key: "noteNum" })

export const validateProjectExists = createAsyncValidator(ProjectModel.projectExists, "not found", { key: "project" })

export const validateProjectNotExists = createAsyncValidator(ProjectModel.projectNotExists, "already exists", { key: "project" })
