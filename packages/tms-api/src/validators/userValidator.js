import { composeAll, composeAny, containsAlphabetsDigitsAndSpecialOnly, containsAlphabetsOrDigitsOnly, createAsyncValidator, isBoolean, isBooleanNumber, isBooleanString, isNonEmptyString, isProvided, isString, matchesEmailAddress, notLongerThan, notShorterThan, nullable } from "@han-keong/tms-validators"

import UserModel from "../models/UserModel.js"

export const validateUsername = composeAll([isProvided, isString, containsAlphabetsOrDigitsOnly, notShorterThan(2), notLongerThan(32)], { key: "username" })

export const validateEmail = nullable(composeAll([isProvided, isNonEmptyString, notLongerThan(254), matchesEmailAddress]), { key: "email" })

export const validatePassword = composeAll([isProvided, isString, containsAlphabetsDigitsAndSpecialOnly, notShorterThan(8), notLongerThan(10)], { key: "password" })

export const validateActive = composeAll([isProvided, composeAny([isBoolean, isBooleanString, isBooleanNumber])], { key: "active" })

export const validateUsernameExists = createAsyncValidator(UserModel.usernameExists, "not found", { key: "username" })

export const validateUsernameNotExists = createAsyncValidator(UserModel.usernameNotExists, "already exists", { key: "username" })

export const validateEmailExists = createAsyncValidator(UserModel.emailExists, "not found", { key: "email" })

export const validateEmailNotExists = createAsyncValidator(UserModel.emailNotExists, "already exists", { key: "email" })
