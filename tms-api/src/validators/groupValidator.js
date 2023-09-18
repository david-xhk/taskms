import { convertToMappedAsyncValidator, createAsyncValidator } from "tms-all/validators/validators.js"

import Group from "../models/Group.js"
import UserGroup from "../models/UserGroup.js"

export const checkGroupExists = createAsyncValidator(Group.groupExists, "not found", "group")

export const checkGroupsExist = convertToMappedAsyncValidator(checkGroupExists, group => `group '${group}'`, "groups")

export const checkGroupNotExists = createAsyncValidator(Group.groupNotExists, "already exists", "group")

export const checkGroupsNotExist = convertToMappedAsyncValidator(checkGroupNotExists, group => `group '${group}'`, "groups")

export const checkUserGroupExists = createAsyncValidator(UserGroup.userGroupExists, "not in group", "username")

export const checkUserGroupsExist = convertToMappedAsyncValidator(checkUserGroupExists, userGroup => `user '${userGroup[0]}'`, "usernames")

export const checkUserGroupNotExists = createAsyncValidator(UserGroup.userGroupNotExists, "already in group", "username")

export const checkUserGroupsNotExist = convertToMappedAsyncValidator(checkUserGroupNotExists, userGroup => `user '${userGroup[0]}'`, "usernames")
