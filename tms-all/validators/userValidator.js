import { composeAll, containsAlphanumericAndSpecial, convertToMappedValidator, curry, hasAlphanumericAndSpecialOnly, hasAlphanumericOnly, isArrayLike, isBooleanLike, isBooleanString, isDefined, isIntegerString, isString, matchesEmailAddress, notEmpty, notLongerThan, notShorterThan } from "./validators.js"

// Backend
export const validateUsername = composeAll([isDefined, isString, notEmpty, hasAlphanumericOnly, notShorterThan(3), notLongerThan(32)], "username")

export const validateUsernames = composeAll([isDefined, isArrayLike, notEmpty, convertToMappedValidator(validateUsername, username => `username '${username}'`)], "usernames")

export const validateEmail = composeAll([isDefined, isString, notEmpty, notLongerThan(255), matchesEmailAddress], "email")

export const validatePassword = composeAll([isDefined, isString, notEmpty, hasAlphanumericAndSpecialOnly, notShorterThan(8), notLongerThan(10), containsAlphanumericAndSpecial], "password")

export const validateActive = composeAll([isDefined, isBooleanLike], "active")

export const validateActiveString = composeAll([isDefined, isBooleanString], "active")

export const validateLimit = composeAll([isDefined, isIntegerString], "limit")

export const validatePage = composeAll([isDefined, isIntegerString], "page")

export const validateOffset = composeAll([isDefined, isIntegerString], "offset")

// Frontend
export const validateUsernameImmediately = composeAll([notLongerThan(32), hasAlphanumericOnly], "username")

export const validateUsernameDelayed = composeAll([notEmpty, notShorterThan(3)], "username")

export const validateEmailImmediately = composeAll([notLongerThan(255)], "email")

export const validateEmailDelayed = composeAll([notEmpty, matchesEmailAddress], "email")

export const validatePasswordImmediately = composeAll([notLongerThan(10), hasAlphanumericAndSpecialOnly], "password")

export const validatePasswordDelayed = composeAll([notEmpty, notShorterThan(8), containsAlphanumericAndSpecial], "password")

export const validateLoginUsername = curry(notEmpty, "username")

export const validateLoginPassword = curry(notEmpty, "password")
