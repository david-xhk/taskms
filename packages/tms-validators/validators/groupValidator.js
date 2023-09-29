import { composeAll, composeAny, containsAlphabetsDigitsOrDashesOnly, convertToMappedValidator, isArray, isCommaSeparatedString, isNonEmptyString, isProvided, notLongerThan } from "./validators.js"

export const validateGroup = composeAll([isProvided, isNonEmptyString, notLongerThan(32), containsAlphabetsDigitsOrDashesOnly], "group")

export const validateGroups = composeAll([isProvided, composeAny([isCommaSeparatedString, isArray]), convertToMappedValidator(validateGroup, (group, key, i) => `group '${group}' in ${key}[${i}]`)], "groups")
