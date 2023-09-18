import { convertToMappedAsyncValidator, createAsyncValidator } from "tms-all/validators/validators.js"

import User from "../models/User.js"

export const checkUsernameExists = createAsyncValidator(User.usernameExists, "not found", "username")

export const checkUsernamesExist = convertToMappedAsyncValidator(checkUsernameExists, username => `user '${username}'`, "usernames")

export const checkUsernameNotExists = createAsyncValidator(User.usernameNotExists, "already exists", "username")

export const checkUsernamesNotExist = convertToMappedAsyncValidator(checkUsernameNotExists, username => `user '${username}'`, "usernames")

export const checkEmailExists = createAsyncValidator(User.emailExists, "not found", "email")

export const checkEmailNotExists = createAsyncValidator(User.emailNotExists, "already exists", "email")
