import { composeAll, convertToMappedValidator, hasAlphanumericOnly, isArrayLike, isCommaSeparatedString, isDefined, isString, notEmpty, notLongerThan } from "./validators.js"

export const validateGroup = composeAll([isDefined, isString, notEmpty, hasAlphanumericOnly, notLongerThan(50)], "group")

export const validateGroups = composeAll([isDefined, isArrayLike, convertToMappedValidator(validateGroup, group => `group '${group}'`)], "groups")

export const validateGroupsString = composeAll([isDefined, isCommaSeparatedString, convertToMappedValidator(validateGroup, group => `group '${group}'`)], "groups")
