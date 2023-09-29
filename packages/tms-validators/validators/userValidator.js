import { composeAll, composeAny, containsAlphabetsDigitsAndSpecial, containsAlphabetsDigitsAndSpecialOnly, containsAlphabetsDigitsOrSpecialOnly, containsAlphabetsOrDigitsOnly, curry, isBoolean, isBooleanNumber, isBooleanString, isNonEmptyString, isProvided, isString, matchesEmailAddress, notEmpty, notLongerThan, notShorterThan, nullable } from "./validators.js"

export const validateUsername = composeAll([isProvided, isString, containsAlphabetsOrDigitsOnly, notShorterThan(2), notLongerThan(32)], "username")

export const validateUsernameImmediately = curry(notLongerThan(32), "username")

export const validateUsernameDelayed = composeAll([notShorterThan(2), containsAlphabetsOrDigitsOnly], "username")

export const validateEmail = nullable(composeAll([isProvided, isNonEmptyString, notLongerThan(255), matchesEmailAddress]), "email")

export const validateEmailImmediately = curry(notLongerThan(255), "email")

export const validateEmailDelayed = composeAll([notEmpty, matchesEmailAddress], "email")

export const validatePassword = composeAll([isProvided, isString, containsAlphabetsDigitsAndSpecialOnly, notShorterThan(8), notLongerThan(10)], "password")

export const validatePasswordImmediately = composeAll([notLongerThan(10), containsAlphabetsDigitsOrSpecialOnly], "password")

export const validatePasswordDelayed = composeAll([notShorterThan(8), containsAlphabetsDigitsAndSpecial], "password")

export const validateActive = composeAll([isProvided, composeAny([isBoolean, isBooleanString, isBooleanNumber])], "active")
