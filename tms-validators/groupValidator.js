import { Group, UserGroup } from "@han-keong/tms-db"
import { composeAll, convertToMappedAsyncValidator, convertToMappedValidator, createAsyncValidator, hasAlphanumericOnly, isArrayLike, isCommaSeparatedString, isDefined, isString, notEmpty, notLongerThan } from "@han-keong/validators"

export const validateGroup = composeAll([isDefined, isString, notEmpty, hasAlphanumericOnly, notLongerThan(50)], "group")

export const validateGroups = composeAll([isDefined, isArrayLike, convertToMappedValidator(validateGroup, group => `group '${group}'`)], "groups")

export const validateGroupsString = composeAll([isDefined, isCommaSeparatedString, convertToMappedValidator(validateGroup, group => `group '${group}'`)], "groups")

export const checkGroupExists = createAsyncValidator(Group.groupExists, "not found", "group")

export const checkGroupsExist = convertToMappedAsyncValidator(checkGroupExists, group => `group '${group}'`, "groups")

export const checkGroupNotExists = createAsyncValidator(Group.groupNotExists, "already exists", "group")

export const checkGroupsNotExist = convertToMappedAsyncValidator(checkGroupNotExists, group => `group '${group}'`, "groups")

export const checkUserGroupExists = createAsyncValidator(UserGroup.userGroupExists, "not in group", "username")

export const checkUserGroupsExist = convertToMappedAsyncValidator(checkUserGroupExists, userGroup => `user '${userGroup[0]}'`, "usernames")

export const checkUserGroupNotExists = createAsyncValidator(UserGroup.userGroupNotExists, "already in group", "username")

export const checkUserGroupsNotExist = convertToMappedAsyncValidator(checkUserGroupNotExists, userGroup => `user '${userGroup[0]}'`, "usernames")
