import { createAsyncValidator } from "@han-keong/tms-validators/validators"

import UserModel from "../models/UserModel.js"

export const validateUsernameExists = createAsyncValidator(UserModel.usernameExists, "not found", "username")

export const validateUsernameNotExists = createAsyncValidator(UserModel.usernameNotExists, "already exists", "username")

export const validateEmailExists = createAsyncValidator(UserModel.emailExists, "not found", "email")

export const validateEmailNotExists = createAsyncValidator(UserModel.emailNotExists, "already exists", "email")
