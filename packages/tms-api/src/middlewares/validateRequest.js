import { hasError, hasErrors } from "@han-keong/tms-validators/validators"

import { ForbiddenError, ValidationError } from "./errorHandler.js"

export default function validateRequest(source, args, options) {
  const { precondition, postcondition } = options ?? {}
  /** @type {[string, { precondition, required, shouldValidate, validators, postcondition }][]} */
  const entries = Object.entries(args ?? {}).map(([key, value]) => {
    let precondition, required, shouldValidate, validators, postcondition
    if (Array.isArray(value)) {
      validators = value
    } else if (typeof value !== "object") {
      validators = [value]
    } else {
      precondition = value.precondition
      required = value.required
      shouldValidate = value.shouldValidate
      validators = value.validators
      postcondition = value.postcondition
    }
    return [key, { precondition, required, shouldValidate, validators, postcondition }]
  })
  return async function validateRequestInner(req, res, next) {
    if (precondition) {
      const err = await precondition(req[source], req, res)
      if (err instanceof Error) {
        return next(err)
      }
    }
    const result = {}
    for (let [key, { precondition, required, shouldValidate, validators, postcondition }] of entries) {
      if (precondition) {
        const err = await precondition(req[source][key], req, res)
        if (err instanceof Error) {
          return next(err)
        }
      }
      if (!required && (req[source][key] === undefined || (shouldValidate !== undefined && !(await shouldValidate(req[source][key], req, res))))) {
        continue
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
  let precondition, shouldValidate, key, validators, postcondition
  if (Array.isArray(args)) {
    validators = args
  } else if (typeof args !== "object") {
    validators = [args]
  } else {
    precondition = args.precondition
    shouldValidate = args.shouldValidate
    key = args.key
    validators = args.validators ?? []
    postcondition = args.postcondition
  }
  return async function validateParamInner(req, res, next, param) {
    if (precondition) {
      const err = await precondition(param, req, res)
      if (err instanceof Error) {
        return next(err)
      }
    }
    if (shouldValidate !== undefined && !(await shouldValidate(param, req, res))) {
      return
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
  if (!req.user.isAdmin()) {
    return new ForbiddenError()
  }
}
