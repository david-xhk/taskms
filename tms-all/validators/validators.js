import { join } from "../helpers/arrayHelper.js"
import { deleteValue, getValue, hasValue, incrementValue, setValue } from "../helpers/objectHelper.js"
import { parseOrCreateArray } from "../helpers/parseHelper.js"
import { sentencify, unsentencify } from "../helpers/stringHelper.js"

export function createValidator(validate, message, key, options) {
  function validator(input, result, key, options) {
    if (validate(input)) {
      if (result) {
        incrementScore(result, key)
      }
      return true
    }
    if (result) {
      updateError(result, message, key, options)
    }
    return false
  }
  return curry(validator, key, options)
}

export function createAsyncValidator(validateAsync, message, key, options) {
  async function validator(input, result, key, options) {
    if (await validateAsync(input)) {
      if (result) {
        incrementScore(result, key)
      }
      return true
    }
    if (result) {
      updateError(result, message, key, options)
    }
    return false
  }
  return curry(validator, key, options)
}

export function convertToMappedValidator(validator, keyFn, key, options) {
  function mappedValidator(input, result, key, options) {
    const inputs = parseOrCreateArray(input)
    const temp = {}
    const keys = inputs.map(keyFn)
    const valid = inputs.map((input, i) => validator(input, temp, keys[i], options))
    const errors = keys
      .filter((_, i) => !valid[i])
      .map(key => getError(temp, key))
      .map(unsentencify)
    if (errors.length === 0) {
      if (result) {
        setScore(result, key, Math.max(...Object.values(getValue(temp, "__validationScores__", [1]))))
      }
      return true
    }
    if (result) {
      setError(result, key, join(errors, ", ", ", and "))
    }
    return false
  }
  return curry(mappedValidator, key, options)
}

export function convertToMappedAsyncValidator(asyncValidator, keyFn, key, options) {
  async function mappedValidator(input, result, key, options) {
    const inputs = parseOrCreateArray(input)
    const temp = {}
    const keys = inputs.map(keyFn)
    const valid = await Promise.allSettled(inputs.map((input, i) => asyncValidator(input, temp, keys[i], options))).then(data => data.map(({ value }) => value))
    const errors = keys
      .filter((_, i) => !valid[i])
      .map(key => getError(temp, key))
      .map(unsentencify)
    if (errors.length === 0) {
      if (result) {
        setScore(result, key, Math.max(...Object.values(getValue(temp, "__validationScores__", [1]))))
      }
      return true
    }
    if (result) {
      setError(result, key, join(errors, ", ", ", and "))
    }
    return false
  }
  return curry(mappedValidator, key, options)
}

export function composeAll(validators, key, options) {
  function validator(input, result, key, options) {
    for (let validator of validators) {
      if (!validator(input, result, key, options)) {
        return false
      }
    }
    return true
  }
  return curry(validator, key, options)
}

export function composeAny(validators, key, options) {
  function validator(input, result, key, options) {
    const scores = []
    const errors = []
    let temp
    for (let validator of validators) {
      temp = {}
      if (validator(input, temp, key, options)) {
        if (result) {
          incrementScore(result, key)
        }
        return true
      }
      scores.push(getValue(temp, ["__validationScores__", key], 0))
      errors.push(unsentencify(getError(temp, key)))
    }
    if (result) {
      const maxScore = Math.max(...scores)
      const maxErrors = errors.filter((_, i) => scores[i] === maxScore)
      setError(result, key, join(maxErrors, ", ", ", or "))
    }
    return false
  }
  return curry(validator, key, options)
}

export function curry(validator, key, options) {
  const curriedKey = key
  const curriedOptions = options
  return (input, result, key, options) => validator(input, result, key ?? curriedKey, { ...options, ...curriedOptions })
}

export function hasError(result, key) {
  return getValue(result, ["__validationScores__", key], 1) === 0
}

export function hasErrors(result) {
  const scores = getValue(result, "__validationScores__", [1])
  return Object.values(scores).reduce((a, b) => a * b) === 0
}

export function getError(result, key) {
  if (key === undefined) {
    const errors = getErrors(result)
    return join(Object.values(errors), " ")
  }
  return getValue(result, ["__validationErrors__", key])
}

export function getErrors(result) {
  if (!hasValue(result, "__validationScores__")) {
    return {}
  }
  const entries = Object.entries(result.__validationScores__)
    .filter(([_, score]) => score === 0)
    .map(([key, _]) => [key, result.__validationErrors__[key]])
  return Object.fromEntries(entries)
}

export function setError(result, key, error) {
  setValue(result, ["__validationErrors__", key], sentencify(error))
  setScore(result, key, 0)
}

export function setErrors(result, errors) {
  for (let [key, error] of Object.entries(errors)) {
    setError(result, key, error)
  }
}

export function deleteError(result, key) {
  deleteValue(result, ["__validationScores__", key])
}

export function deleteErrors(result) {
  delete result.__validationScores__
}

function updateError(result, message, key, options) {
  const prefix = getValue(options, "prefix", key)
  const error = `${prefix} ${message}`
  setError(result, key, error)
}

function setScore(result, key, score) {
  setValue(result, ["__validationScores__", key], score)
}

function incrementScore(result, key) {
  incrementValue(result, ["__validationScores__", key])
}

// Type validators
export const isDefined = createValidator(input => input !== undefined, "must be provided")
export const isString = createValidator(input => typeof input === "string", "must be a string")
export const isBoolean = createValidator(input => typeof input === "boolean", "must be a boolean")
export const isInteger = createValidator(Number.isInteger, "must be an integer")
export const isNumber = createValidator(input => typeof input === "number", "must be a number")
export const isArray = createValidator(Array.isArray, "must be an array")

// Equality validators
export const isEqualTo = value => createValidator(input => input === value, `must be equal to ${value}`)
export const notEqualTo = value => createValidator(input => input !== value, `must not be equal to ${value}`)
export const isEither = (...values) => createValidator(input => values.includes(input), `must be either ${join(values, ", ", " or ")}`)
export const isNeither = (...values) => createValidator(input => !values.includes(input), `must be neither ${join(values, ", ", " or ")}`)

// Comparison validators
export const moreThan = value => createValidator(input => input > value, `must be more than ${value}`)
export const notMoreThan = value => createValidator(input => input <= value, `must not be more than ${value}`)
export const lessThan = value => createValidator(input => input < value, `must be less than ${value}`)
export const notLessThan = value => createValidator(input => input >= value, `must not be less than ${value}`)
export const isPositive = moreThan(0)
export const isNonPositive = notMoreThan(0)
export const isNegative = lessThan(0)
export const isNonNegative = notLessThan(0)

// Length validators
export const notEmpty = createValidator(input => input.length !== 0, "must not be empty")
export const isLength = length => createValidator(input => input.length === length, `must have length ${length}`)
export const notShorterThan = length => createValidator(input => input.length >= length, `must have at least length ${length}`)
export const notLongerThan = length => createValidator(input => input.length <= length, `must have at most length ${length}`)
export const shorterThan = length => notLongerThan(length - 1)
export const longerThan = length => notShorterThan(length + 1)

// Regex validators
export const matches = (regex, message) => createValidator(input => regex.test(input), message)
export const containsAlphabets = matches(/[a-zA-Z]/, "must contain alphabets")
export const containsDigits = matches(/[0-9]/, "must contain digits")
export const containsSpecial = matches(/[!-\/:-@[-`{-~]/, "must contain special characters")
export const containsWhitespace = matches(/[\s]/, "must contain whitespace")
export const containsAlphanumeric = composeAll([containsAlphabets, containsDigits])
export const containsAlphanumericAndSpecial = composeAll([containsAlphabets, containsDigits, containsSpecial])

export const doesNotMatch = (regex, message) => createValidator(input => !regex.test(input), message)
export const hasNoAlphabets = doesNotMatch(/[a-zA-Z]/, "must not contain alphabets")
export const hasNoDigits = doesNotMatch(/[0-9]/, "must not contain digits")
export const hasNoSpecial = doesNotMatch(/[!-\/:-@[-`{-~]/, "must not contain special characters")
export const hasNoWhitespace = doesNotMatch(/[\s]/, "must not contain whitespace")

export const hasAlphabetsOnly = doesNotMatch(/[^a-zA-Z]/, "must contain alphabets only")
export const hasDigitsOnly = doesNotMatch(/[^0-9]/, "must contain digits only")
export const hasSpecialOnly = doesNotMatch(/[^!-\/:-@[-`{-~]/, "must contain special characters only")
export const hasWhitespaceOnly = doesNotMatch(/[^\s]/, "must contain whitespace only")
export const hasAlphanumericOnly = doesNotMatch(/[^a-zA-Z0-9]/, "must contain alphabets or digits only")
export const hasAlphanumericAndSpecialOnly = doesNotMatch(/[^a-zA-Z0-9!-\/:-@[-`{-~]/, "must contain alphanumeric and special characters only")

export const matchesInteger = matches(/^([+-]?[0-9]+)?$/, "must be an integer")
export const matchesNumber = matches(/^([+-]?([0-9]*[.])?[0-9]+)?$/, "must be a float")
export const matchesBoolean = matches(/^(true|false|yes|no|1|0)?$/i, "must be 'true', 'false', 'yes', 'no', '1', or '0'")
export const matchesCsv = matches(/^(([^,]+,)+[^,]+)?$/, "must be a comma-separated string")
// Reference for email regex pattern: https://stackoverflow.com/a/1373724/
export const matchesEmailAddress = matches(/^([a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)?$/, "must be a valid email address")

// String validators
export const isAlphabeticalString = composeAll([isString, notEmpty, hasAlphabetsOnly])
export const isNumericString = composeAll([isString, notEmpty, hasDigitsOnly])
export const isAlphanumericString = composeAll([isString, notEmpty, hasAlphanumericOnly])
export const isAlphanumericAndSpecialString = composeAll([isString, notEmpty, hasAlphanumericAndSpecialOnly])
export const isIntegerString = composeAll([isString, notEmpty, matchesInteger])
export const isNumberString = composeAll([isString, notEmpty, matchesNumber])
export const isBooleanString = composeAll([isString, notEmpty, matchesBoolean])
export const isCommaSeparatedString = composeAll([isString, notEmpty, matchesCsv])
export const isEmailAddressString = composeAll([isString, notEmpty, matchesEmailAddress])

// Integer validators
export const isPositiveInteger = composeAll([isInteger, isPositive])
export const isNonPositiveInteger = composeAll([isInteger, isNonPositive])
export const isNegativeInteger = composeAll([isInteger, isNegative])
export const isNonNegativeInteger = composeAll([isInteger, isNonNegative])
export const isIntegerLike = composeAny([isInteger, isIntegerString])

// Number validators
export const isPositiveNumber = composeAll([isNumber, isPositive])
export const isNonPositiveNumber = composeAll([isNumber, isNonPositive])
export const isNegativeNumber = composeAll([isNumber, isNegative])
export const isNonNegativeNumber = composeAll([isNumber, isNonNegative])
export const isBooleanNumber = composeAll([isNumber, isEither(0, 1)])
export const isNumberLike = composeAny([isNumber, isNumberString])

// Boolean validators
export const isBooleanLike = composeAny([isBoolean, isBooleanString, isBooleanNumber])

// Array validators
export const isArrayLike = composeAny([isArray, isCommaSeparatedString])
export const isArrayOrString = composeAny([isArray, isString])
