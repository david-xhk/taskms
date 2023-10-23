import { hasError, hasErrors } from "@han-keong/tms-validators"

import { ForbiddenError, ValidationError } from "./errorHandler.js"

export default function validateRequest(source, args, options) {
  const { precondition, postcondition } = options ?? {}
  /** @type {[string, { required, shouldValidate, validators, precondition, postcondition }][]} */
  const entries = Object.entries(args ?? {}).map(([key, value]) => {
    let required, shouldValidate, validators, precondition, postcondition
    if (Array.isArray(value)) {
      validators = value
    } else if (typeof value !== "object") {
      validators = [value]
    } else {
      required = value.required
      shouldValidate = value.shouldValidate
      validators = value.validators
      precondition = value.precondition
      postcondition = value.postcondition
    }
    return [key, { required, shouldValidate, validators, precondition, postcondition }]
  })
  return async function validateRequestInner(req, res, next) {
    if (precondition) {
      const err = await precondition(req[source], req, res)
      if (err instanceof Error) {
        return next(err)
      }
    }
    const result = {}
    for (let [key, { required, shouldValidate, validators, precondition, postcondition }] of entries) {
      if (!required && (req[source][key] === undefined || (shouldValidate !== undefined && !(await shouldValidate(req[source][key], req, res))))) {
        continue
      }
      if (precondition) {
        const err = await precondition(req[source][key], req, res)
        if (err instanceof Error) {
          return next(err)
        }
      }
      for (let validator of validators) {
        try {
          if (!(await validator(req[source][key], result, key))) {
            break
          }
        } catch (err) {
          return next(err)
        }
      }
      if (!hasError(result, key) && postcondition) {
        const err = await postcondition(req[source][key], req, res)
        if (err instanceof Error) {
          return next(err)
        }
      }
    }
    if (hasErrors(result)) {
      return next(new ValidationError(result))
    }
    if (postcondition) {
      const err = await postcondition(req[source], req, res)
      if (err instanceof Error) {
        return next(err)
      }
    }
    next()
  }
}

export function validateParam(args) {
  let key, shouldValidate, validators, precondition, postcondition
  if (Array.isArray(args)) {
    validators = args
  } else if (typeof args !== "object") {
    validators = [args]
  } else {
    key = args.key
    shouldValidate = args.shouldValidate
    validators = args.validators ?? []
    precondition = args.precondition
    postcondition = args.postcondition
  }
  return async function validateParamInner(req, res, next, param) {
    if (shouldValidate !== undefined && !(await shouldValidate(param, req, res))) {
      return next()
    }
    if (precondition) {
      const err = await precondition(param, req, res)
      if (err instanceof Error) {
        return next(err)
      }
    }
    const result = {}
    for (let validator of validators) {
      try {
        if (!(await validator(param, result, key))) {
          break
        }
      } catch (err) {
        return next(err)
      }
    }
    if (hasErrors(result)) {
      return next(new ValidationError(result))
    }
    if (postcondition) {
      const err = await postcondition(param, req, res)
      if (err instanceof Error) {
        return next(err)
      }
    }
    next()
  }
}

export function currentUserIsAdmin(_, req) {
  if (!req.user.isAdmin) {
    return new ForbiddenError()
  }
}
