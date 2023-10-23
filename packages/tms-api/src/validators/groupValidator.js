import GroupModel from "@han-keong/tms-models/GroupModel"
import UserGroupModel from "@han-keong/tms-models/UserGroupModel"
import { composeAll, composeAny, containsAlphabetsDigitsSpecialOrSpacesOnly, convertToAsyncMappedValidator, convertToMappedValidator, createAsyncValidator, isArray, isCommaSeparatedString, isNonEmptyString, isProvided, notLongerThan } from "@han-keong/tms-validators"

export const validateGroup = composeAll([isProvided, isNonEmptyString, notLongerThan(32), containsAlphabetsDigitsSpecialOrSpacesOnly], { key: "group" })

export const mappedGroupValidator = convertToMappedValidator(validateGroup, (group, key, i) => `group '${group}' in ${key}[${i}]`)

export const validateGroups = composeAll([isProvided, composeAny([isCommaSeparatedString, isArray]), mappedGroupValidator], { key: "groups" })

export const validateGroupExists = createAsyncValidator(GroupModel.groupExists, "not found", { key: "group" })

export const validateGroupsExist = convertToAsyncMappedValidator(validateGroupExists, (group, key, i) => `group '${group}' in ${key}[${i}]`, { key: "groups" })

export const validateGroupNotExists = createAsyncValidator(GroupModel.groupNotExists, "already exists", { key: "group" })

export const validateGroupsNotExist = convertToAsyncMappedValidator(validateGroupNotExists, (group, key, i) => `group '${group}' in ${key}[${i}]`, { key: "groups" })

export const validateUserGroupExists = createAsyncValidator(UserGroupModel.userGroupExists, "not in group", { key: "username" })

export const validateUserGroupNotExists = createAsyncValidator(UserGroupModel.userGroupNotExists, "already in group", { key: "username" })
