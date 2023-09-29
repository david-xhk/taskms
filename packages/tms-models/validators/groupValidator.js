import { convertToAsyncMappedValidator, createAsyncValidator } from "@han-keong/tms-validators/validators"

import GroupModel from "../models/GroupModel.js"
import UserGroupModel from "../models/UserGroupModel.js"

export const validateGroupExists = createAsyncValidator(GroupModel.groupExists, "not found", "group")

export const validateGroupsExist = convertToAsyncMappedValidator(validateGroupExists, (group, key, i) => `group '${group}' in ${key}[${i}]`, "groups")

export const validateGroupNotExists = createAsyncValidator(GroupModel.groupNotExists, "already exists", "group")

export const validateGroupsNotExist = convertToAsyncMappedValidator(validateGroupNotExists, (group, key, i) => `group '${group}' in ${key}[${i}]`, "groups")

export const validateUserGroupExists = createAsyncValidator(UserGroupModel.userGroupExists, "not in group", "username")

export const validateUserGroupNotExists = createAsyncValidator(UserGroupModel.userGroupNotExists, "already in group", "username")
