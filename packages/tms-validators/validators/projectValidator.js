import { composeAll, composeAny, containsAlphabetsDigitsOrDashesOnly, containsAlphabetsDigitsSpecialOrSpacesOnly, isDateOrISODateString, isEither, isHexColourString, isInteger, isIntegerString, isNonEmptyString, isProvided, isString, moreThan, notLongerThan } from "./validators.js"

export const validateProject = composeAll([isProvided, isNonEmptyString, notLongerThan(32), containsAlphabetsDigitsOrDashesOnly], "project")

export const validateRunningNum = composeAll([isProvided, composeAny([isInteger, isIntegerString]), moreThan(0)], "runningNum")

export const validateDate = composeAll([isProvided, isDateOrISODateString], "date")

export const validateDescription = composeAll([isProvided, isNonEmptyString], "description")

export const validatePlan = composeAll([isProvided, isNonEmptyString, notLongerThan(32), containsAlphabetsDigitsOrDashesOnly], "plan")

export const validateColour = composeAll([isProvided, isHexColourString], "colour")

export const validateTask = composeAll([isProvided, isNonEmptyString, notLongerThan(32), containsAlphabetsDigitsSpecialOrSpacesOnly], "task")

export const validateTaskNum = composeAll([isProvided, isIntegerString, moreThan(0)], "taskNum")

export const validateTaskState = composeAll([isProvided, isString, isEither("open", "todo", "doing", "done", "closed")])

export const validateNoteContent = composeAll([isProvided, isNonEmptyString], "content")

export const validateNoteNum = composeAll([isProvided, isIntegerString, moreThan(0)], "noteNum")
