import { parseOrCreateArray } from "@han-keong/tms-helpers/parseHelper"
import { join, sentencify, unsentencify } from "@han-keong/tms-helpers/stringHelper"

/**
 * @typedef {{ [key: string]: string }} ValidationErrors
 * @typedef {{ [key: string]: boolean }} ValidationFlags
 * @typedef {{ [key: string]: number }} ValidationScores
 *
 * @typedef {object} ValidationResult
 * @property {ValidationErrors} [errors]
 * @property {ValidationFlags} [flags]
 * @property {ValidationScores} [scores]
 *
 * @typedef {object} ValidationOptions
 * @property {string} [key]
 * @property {string} [error]
 * @property {string} [prefix]
 * @property {string} [message]
 *
 * @callback Validator
 * @param {any} input
 * @param {ValidationResult} [result]
 * @param {ValidationOptions} [options]
 * @returns {boolean}
 *
 * @callback AsyncValidator
 * @param {any} input
 * @param {ValidationResult} [result]
 * @param {ValidationOptions} [options]
 * @returns {Promise<boolean>}
 */

/**
 * @param {ValidationResult} result
 * @param {string} key
 * @returns {boolean}
 */
export function hasError(result, key) {
  if (!(result.flags && key in result.flags)) {
    return false
  }
  return result.flags[key]
}

/**
 * @param {ValidationResult} result
 * @returns {boolean}
 */
export function hasErrors(result) {
  if (!result.flags) {
    return false
  }
  return Object.values(result.flags).reduce((a, b) => a || b, false)
}

/**
 * @param {ValidationResult} result
 * @param {string} [key]
 * @returns {string?}
 */
export function getError(result, key) {
  if (key === undefined) {
    const errors = Object.values(getErrors(result))
    if (errors.length > 0) {
      return join(errors, " ")
    }
  } else if (result.errors && key in result.errors) {
    return result.errors[key]
  }
  return null
}

/**
 * @param {ValidationResult} result
 * @returns {ValidationErrors}
 */
export function getErrors(result) {
  const { errors, flags } = result
  if (errors === undefined || flags === undefined) {
    return {}
  }
  return Object.fromEntries(Object.entries(errors).filter(entry => flags[entry[0]]))
}

/**
 * @param {ValidationResult} result
 * @param {string} key
 * @param {string} error
 */
export function setError(result, key, error) {
  if (!result.errors) {
    result.errors = {}
  }
  result.errors[key] = sentencify(error)
  if (!result.flags) {
    result.flags = {}
  }
  result.flags[key] = true
}

/**
 * @param {ValidationResult} result
 * @param {ValidationErrors} errors
 */
export function setErrors(result, errors) {
  for (let [key, error] of Object.entries(errors)) {
    setError(result, key, error)
  }
}

/**
 * @param {ValidationResult} result
 * @param {string} key
 */
export function deleteError(result, key) {
  if (result.flags && key in result.flags) {
    result.flags[key] = false
  }
}

/**
 * @param {ValidationResult} result
 */
export function deleteErrors(result) {
  if (result.flags) {
    for (let key of Object.keys(result.flags)) {
      result.flags[key] = false
    }
  }
}

/**
 * @param {string} message
 * @param {ValidationResult} result
 * @param {string} key
 * @param {ValidationOptions} [options]
 */
function updateError(message, result, key, options) {
  const error = options?.error || `${options?.prefix || key} ${options?.message || message}`
  setError(result, key, error)
}

/**
 * @param {ValidationResult} result
 * @param {string} key
 */
function getScore(result, key) {
  if (!(result.scores && key in result.scores)) {
    return 0
  }
  return result.scores[key]
}

/**
 * @param {ValidationResult} result
 */
function getMaxScore(result) {
  if (!result.scores) {
    return null
  }
  const scores = Object.values(result.scores)
  return Math.max(...scores)
}

/**
 * @param {ValidationResult} result
 * @param {string} key
 * @param {number} score
 */
function setScore(result, key, score) {
  if (!result.scores) {
    result.scores = {}
  }
  result.scores[key] = score
}

/**
 * @param {ValidationResult} result
 * @param {string} key
 */
function incrementScore(result, key) {
  if (!result.scores) {
    result.scores = {}
  }
  if (!(key in result.scores)) {
    result.scores[key] = 0
  }
  result.scores[key] += 1
}

/**
 * @param {(input: any) => boolean} validate
 * @param {string} message
 * @param {ValidationOptions} [options]
 * @returns {Validator}
 */
export function createValidator(validate, message, options) {
  /** @type {Validator} */
  function validator(input, result, options) {
    if (!result || !options?.key) {
      return validate(input)
    }
    const { key } = options
    if (validate(input)) {
      incrementScore(result, key)
      return true
    }
    updateError(message, result, key, options)
    return false
  }
  return curry(validator, options)
}

/**
 * @param {Validator} validator
 * @param {(input: any, key: string, index: number) => string} keyFn
 * @param {ValidationOptions} [options]
 * @returns {Validator}
 */
export function convertToMappedValidator(validator, keyFn, options) {
  /** @type {Validator} */
  function mappedValidator(input, result, options) {
    const inputs = parseOrCreateArray(input)
    if (!result || !options?.key) {
      return inputs.map(input => validator(input)).reduce((a, b) => a && b, true)
    }
    const { key } = options
    const temp = /** @type {ValidationResult} */ ({})
    const keys = inputs.map((input, i) => keyFn(input, options?.prefix ?? key, i))
    const valid = inputs.map((input, i) => validator(input, temp, { ...options, key: keys[i] }))
    const errors = keys
      .filter((_, i) => !valid[i])
      .map(key => /** @type {string} */ (getError(temp, key)))
      .map(unsentencify)
    if (errors.length === 0) {
      setScore(result, key, getMaxScore(temp) ?? 1)
      return true
    }
    setError(result, key, join(errors, ", ", ", and "))
    return false
  }
  return curry(mappedValidator, options)
}

/**
 * @param {Validator[]} validators
 * @param {ValidationOptions} [options]
 * @returns {Validator}
 */
export function composeAll(validators, options) {
  /** @type {Validator} */
  function validator(input, result, options) {
    for (let validator of validators) {
      if (!validator(input, result, options)) {
        return false
      }
    }
    return true
  }
  return curry(validator, options)
}

/**
 * @param {Validator[]} validators
 * @param {ValidationOptions} [options]
 * @returns {Validator}
 */
export function composeAny(validators, options) {
  /** @type {Validator} */
  function validator(input, result, options) {
    if (!result || !options?.key) {
      for (let validator of validators) {
        if (validator(input)) {
          return true
        }
      }
      return false
    }
    const { key } = options
    const scores = []
    const errors = []
    let temp
    for (let validator of validators) {
      temp = {}
      if (validator(input, temp, options)) {
        incrementScore(result, key)
        return true
      }
      scores.push(getScore(temp, key))
      errors.push(unsentencify(/** @type {string} */ (getError(temp, key))))
    }
    const maxScore = Math.max(...scores)
    const maxErrors = errors.filter((_, i) => scores[i] === maxScore)
    setError(result, key, join(maxErrors, ", ", ", or "))
    return false
  }
  return curry(validator, options)
}

/**
 * @param {Validator} validator
 * @param {ValidationOptions} [options]
 * @returns {Validator}
 */
export function curry(validator, options) {
  const { ...curriedOptions } = options ?? {}
  return (input, result, options) => validator(input, result, { ...curriedOptions, ...options })
}

/**
 * @param {(input: any) => Promise<boolean>} validateAsync
 * @param {string} message
 * @param {ValidationOptions} [options]
 * @returns {AsyncValidator}
 */
export function createAsyncValidator(validateAsync, message, options) {
  /** @type {AsyncValidator} */
  async function asyncValidator(input, result, options) {
    if (!result || !options?.key) {
      return await validateAsync(input)
    }
    const { key } = options
    if (await validateAsync(input)) {
      incrementScore(result, key)
      return true
    }
    updateError(message, result, key, options)
    return false
  }
  return curryAsync(asyncValidator, options)
}

/**
 * @param {AsyncValidator} asyncValidator
 * @param {(input: any, key: string, index: number) => string} keyFn
 * @param {ValidationOptions} [options]
 * @returns {AsyncValidator}
 */
export function convertToAsyncMappedValidator(asyncValidator, keyFn, options) {
  /** @type {AsyncValidator} */
  async function asyncMappedValidator(input, result, options) {
    const inputs = parseOrCreateArray(input)
    if (!result || !options?.key) {
      return await Promise.allSettled(inputs.map(input => asyncValidator(input))).then(results => results.reduce((stillValid, result) => stillValid && result.status === "fulfilled" && result.value, true))
    }
    const { key } = options
    const temp = /** @type {ValidationResult} */ ({})
    const keys = inputs.map((input, i) => keyFn(input, options?.prefix ?? key, i))
    const valid = await Promise.allSettled(inputs.map((input, i) => asyncValidator(input, temp, { ...options, key: keys[i] }))).then(results => results.map(result => result.status === "fulfilled" && result.value))
    const errors = keys
      .filter((_, i) => !valid[i])
      .map(key => /** @type {string} */ (getError(temp, key)))
      .map(unsentencify)
    if (errors.length === 0) {
      setScore(result, key, getMaxScore(temp) ?? 1)
      return true
    }
    setError(result, key, join(errors, ", ", ", and "))
    return false
  }
  return curryAsync(asyncMappedValidator, options)
}

/**
 * @param {AsyncValidator} asyncValidator
 * @param {ValidationOptions} [options]
 * @returns {AsyncValidator}
 */
export function curryAsync(asyncValidator, options) {
  const { ...curriedOptions } = options ?? {}
  return (input, result, options) => asyncValidator(input, result, { ...curriedOptions, ...options })
}

// Type validators
export const isString = createValidator(input => typeof input === "string", "must be a string")
export const isBoolean = createValidator(input => typeof input === "boolean", "must be a boolean")
export const isInteger = createValidator(Number.isInteger, "must be an integer")
export const isNumber = createValidator(input => typeof input === "number", "must be a number")
export const isNotNaN = createValidator(input => !isNaN(input), "must be a valid number")
export const isArray = createValidator(Array.isArray, "must be an array")
export const isDate = createValidator(input => Object.prototype.toString.call(input) === "[object Date]", "must be an instance of Date")
export const isProvided = createValidator(input => input !== undefined, "must be provided")
export const isNotProvided = createValidator(input => input === undefined, "must not be provided")
export const isNull = createValidator(input => input === null, "must be null")
export const isNotNull = createValidator(input => input !== null, "must not be null")
/**
 * @param {Validator} validator
 * @param {ValidationOptions} [options]
 */
export const nullable = (validator, options) => composeAny([composeAll([isProvided, isNull]), validator], options)

// Equality validators
export const isEqualTo = (/** @type {any} */ value) => createValidator(input => input === value, `must be equal to ${value}`)
export const notEqualTo = (/** @type {any} */ value) => createValidator(input => input !== value, `must not be equal to ${value}`)
export const isEither = (/** @type {any[]} */ ...values) => {
  const options = values.map(value => (typeof value === "string" ? `'${value}'` : value))
  return createValidator(input => values.includes(input), `must be ${join(options, ", ", " or ")}`)
}
export const isNeither = (/** @type {any[]} */ ...values) => {
  const options = values.map(value => (typeof value === "string" ? `'${value}'` : value))
  return createValidator(input => !values.includes(input), `must not be ${join(options, ", ", " or ")}`)
}

// Comparison validators
export const moreThan = (/** @type {number} */ value) => createValidator(input => input > value, `must be more than ${value}`)
export const notMoreThan = (/** @type {number} */ value) => createValidator(input => input <= value, `must not be more than ${value}`)
export const lessThan = (/** @type {number} */ value) => createValidator(input => input < value, `must be less than ${value}`)
export const notLessThan = (/** @type {number} */ value) => createValidator(input => input >= value, `must not be less than ${value}`)
export const isPositive = moreThan(0)
export const isNonPositive = notMoreThan(0)
export const isNegative = lessThan(0)
export const isNonNegative = notLessThan(0)

// Length validators
export const notEmpty = createValidator(input => input.length !== 0, "must not be empty")
export const isLength = (/** @type {number} */ length) => createValidator(input => input.length === length, `must have length ${length}`)
export const notShorterThan = (/** @type {number} */ length) => createValidator(input => input.length >= length, `must have at least length ${length}`)
export const notLongerThan = (/** @type {number} */ length) => createValidator(input => input.length <= length, `must have at most length ${length}`)
export const shorterThan = (/** @type {number} */ length) => notLongerThan(length - 1)
export const longerThan = (/** @type {number} */ length) => notShorterThan(length + 1)

// Regex validators
export const matches = (/** @type {RegExp} */ regex, /** @type {string} */ message) => createValidator(input => regex.test(input), message)
export const doesNotMatch = (/** @type {RegExp} */ regex, /** @type {string} */ message) => createValidator(input => !regex.test(input), message)
export const contains = (/** @type {string[]} */ chars, /** @type {string} */ message) => matches(new RegExp(`[${chars.map(char => char.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&")).join("")}]`), message)
export const doesNotContain = (/** @type {string[]} */ chars, /** @type {string} */ message) => doesNotMatch(new RegExp(`[${chars.map(char => char.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&")).join("")}]`), message)
export const containsOnly = (/** @type {string[]} */ chars, /** @type {string} */ message) => doesNotMatch(new RegExp(`[^${chars.map(char => char.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&")).join("")}]`), message)

export const ALPHABETS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
export const DIGITS = "0123456789"
export const SPECIAL_CHARS = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
export const WHITESPACE = "\r\n\t\f\v "

export const containsAlphabets = contains([ALPHABETS], "must contain alphabets")
export const containsDigits = contains([DIGITS], "must contain digits")
export const containsSpecial = contains([SPECIAL_CHARS], "must contain special characters")
export const containsWhitespace = contains([WHITESPACE], "must contain whitespace")
export const containsAlphabetsOrDigits = contains([ALPHABETS, DIGITS], "must contain alphabets or digits")
export const containsAlphabetsDigitsOrSpecial = contains([ALPHABETS, DIGITS, SPECIAL_CHARS], "must contain alphabets or digits or special characters")
export const containsAlphabetsDigitsOrWhitespace = contains([ALPHABETS, DIGITS, WHITESPACE], "must contain alphabets or digits or whitespace")

export const doesNotContainAlphabets = doesNotContain([ALPHABETS], "must not contain alphabets")
export const doesNotContainDigits = doesNotContain([DIGITS], "must not contain digits")
export const doesNotContainSpecial = doesNotContain([SPECIAL_CHARS], "must not contain special characters")
export const doesNotContainWhitespace = doesNotContain([WHITESPACE], "must not contain whitespace")
export const doesNotContainAlphabetsOrDigits = doesNotContain([ALPHABETS, DIGITS], "must not contain alphabets or digits")
export const doesNotContainAlphabetsDigitsOrSpecial = doesNotContain([ALPHABETS, DIGITS, SPECIAL_CHARS], "must not contain alphabets or digits or special characters")
export const doesNotContainAlphabetsDigitsOrWhitespace = doesNotContain([ALPHABETS, DIGITS, WHITESPACE], "must not contain alphabets or digits or whitespace")

export const containsAlphabetsOnly = containsOnly([ALPHABETS], "must contain alphabets only")
export const containsDigitsOnly = containsOnly([DIGITS], "must contain digits only")
export const containsSpecialOnly = containsOnly([SPECIAL_CHARS], "must contain special characters only")
export const containsWhitespaceOnly = containsOnly([WHITESPACE], "must contain whitespace only")
export const containsAlphabetsOrDigitsOnly = containsOnly([ALPHABETS, DIGITS], "must contain alphabets or digits only")
export const containsAlphabetsDigitsOrSpecialOnly = containsOnly([ALPHABETS, DIGITS, SPECIAL_CHARS], "must contain alphabets, digits, or special characters only")
export const containsAlphabetsDigitsOrWhitespaceOnly = containsOnly([ALPHABETS, DIGITS, WHITESPACE], "must contain alphabets, digits, or whitespace only")
export const containsAlphabetsDigitsSpecialOrSpacesOnly = containsOnly([ALPHABETS, DIGITS, SPECIAL_CHARS, " "], "must contain alphabets, digits, special characters, or spaces only")
export const containsAlphabetsDigitsOrDashesOnly = containsOnly([ALPHABETS, DIGITS, "-"], "must contain alphabets, digits, or dashes only")
export const containsAlphabetsDigitsDashesOrUnderscoresOnly = containsOnly([ALPHABETS, DIGITS, "-", "_"], "must contain alphabets, digits, dashes, or underscores only")

export const containsAlphabetsAndDigits = composeAll([containsAlphabets, containsDigits])
export const containsAlphabetsDigitsAndSpecial = composeAll([containsAlphabets, containsDigits, containsSpecial])
export const containsAlphabetsDigitsAndWhitespace = composeAll([containsAlphabets, containsDigits, containsWhitespace])

export const containsAlphabetsAndDigitsOnly = composeAll([containsAlphabetsOrDigitsOnly, containsAlphabetsAndDigits])
export const containsAlphabetsDigitsAndSpecialOnly = composeAll([containsAlphabetsDigitsOrSpecialOnly, containsAlphabetsDigitsAndSpecial])
export const containsAlphabetsDigitsAndWhitespaceOnly = composeAll([containsAlphabetsDigitsOrWhitespaceOnly, containsAlphabetsDigitsAndWhitespace])

export const matchesInteger = matches(/^([+-]?[0-9]+)?$/, "must be an integer")
export const matchesNumber = matches(/^([+-]?([0-9]*[.])?[0-9]+)?$/, "must be a number")
export const matchesBoolean = matches(/^(true|false|yes|no|1|0)?$/i, "must be 'true', 'false', 'yes', 'no', '1', or '0'")
export const matchesCommaSeparated = matches(/^(([^,]+,)*[^,]+)?$/, "must be a comma-separated string")
// Reference for hex colour pattern: https://stackoverflow.com/a/72127981
export const matchesHexColour = matches(/^#([a-f0-9]{3,4}|[a-f0-9]{6}|[a-f0-9]{8})$/i, "must be a hex colour")
// Reference for email regex pattern: https://stackoverflow.com/a/1373724
export const matchesEmailAddress = matches(/^([a-z0-9!#$%&'*+\\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)?$/, "must be a valid email address")
// Reference for date regex patterns: https://uibakery.io/regex-library/date
export const matchesMMDDYYYYDate = matches(/^(0?[1-9]|1[0-2])[/.\- ](0?[1-9]|[12][0-9]|3[01])[/.\- ][0-9]{2}?[0-9]{2}$/, "must be in MM/DD/YYYY format")
export const matchesYYYYMMDDDate = matches(/^[0-9]{2}?[0-9]{2}[/.\- ](0?[1-9]|1[0-2])[/.\- ](0?[1-9]|[12][0-9]|3[01])$/, "must be in YYYY/MM/DD format")
export const matchesISODate = matches(/^(?:\d{4})-(?:\d{2})-(?:\d{2})T(?:\d{2}):(?:\d{2}):(?:\d{2}(?:\.\d*)?)(?:(?:-(?:\d{2}):(?:\d{2})|Z)?)$/, "must be in ISO date format")
export const matchesDate = composeAny([matchesMMDDYYYYDate, matchesYYYYMMDDDate, matchesISODate])

// String validators
export const isNonEmptyString = composeAll([isString, notEmpty])
export const isStringWithAlphabetsOnly = composeAll([isString, containsAlphabetsOnly])
export const isStringWithDigitsOnly = composeAll([isString, containsDigitsOnly])
export const isStringWithAlphabetsOrDigitsOnly = composeAll([isString, containsAlphabetsOrDigitsOnly])
export const isStringWithAlphabetsDigitsOrSpecialOnly = composeAll([isString, containsAlphabetsDigitsOrSpecialOnly])
export const isStringWithAlphabetsDigitsAndSpecialOnly = composeAll([isString, containsAlphabetsDigitsAndSpecialOnly])
export const isStringWithAlphabetsDigitsOrWhitespaceOnly = composeAll([isString, containsAlphabetsDigitsOrWhitespaceOnly])
export const isIntegerString = composeAll([isNonEmptyString, matchesInteger])
export const isNumberString = composeAll([isNonEmptyString, matchesNumber])
export const isBooleanString = composeAll([isNonEmptyString, matchesBoolean])
export const isCommaSeparatedString = composeAll([isString, matchesCommaSeparated])
export const isHexColourString = composeAll([isNonEmptyString, matchesHexColour])
export const isEmailAddressString = composeAll([isNonEmptyString, matchesEmailAddress])
export const isMMDDYYYDateString = composeAll([isNonEmptyString, matchesMMDDYYYYDate])
export const isYYYYMMDDDateString = composeAll([isNonEmptyString, matchesYYYYMMDDDate])
export const isISODateString = composeAll([isNonEmptyString, matchesISODate])
export const isDateString = composeAll([isNonEmptyString, matchesDate])

// Integer validators
export const isPositiveInteger = composeAll([isInteger, isPositive])
export const isNonPositiveInteger = composeAll([isInteger, isNonPositive])
export const isNegativeInteger = composeAll([isInteger, isNegative])
export const isNonNegativeInteger = composeAll([isInteger, isNonNegative])
export const isIntegerLike = composeAny([isInteger, isIntegerString])
export const isPositiveIntegerLike = composeAll([isIntegerLike, isPositive])
export const isNonPositiveIntegerLike = composeAll([isIntegerLike, isNonPositive])
export const isNegativeIntegerLike = composeAll([isIntegerLike, isNegative])
export const isNonNegativeIntegerLike = composeAll([isIntegerLike, isNonNegative])

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
export const isNonEmptyArray = composeAll([isArray, notEmpty])
export const isArrayOrString = composeAny([isArray, isString])
export const isArrayLike = composeAny([isArray, isCommaSeparatedString])

// Date validators
export const isValidDate = composeAll([isDate, isNotNaN])
export const isDateLike = composeAny([isValidDate, isDateString])
