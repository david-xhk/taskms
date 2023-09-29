# `tms-validators`

## What's this about?

Validation code gets boring. Writing conditions with similar error messages but for so many different fields. That's what `validators` is trying to improve: to make validation logic **imperative**, **simple**, and **reusable** instead of being declarative, cumbersome, and repetitive.

## What do you mean?

### Typical validation code

```js
function validateUsername(username, errors) {
  let errorMessage
  if (username === undefined) {
    errorMessage = "Username must be provided."
  } else if (typeof username !== "string") {
    errorMessage = "Username must be a string."
  } else if (username === "") {
    errorMessage = "Username must not be empty."
  } else if (username.length < 3) {
    errorMessage = "Username must have at least length 3."
  } else if (username.length > 32) {
    errorMessage = "Username must have at most length 32."
  } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
    errorMessage = "Username must only contain alphanumeric characters."
  }
  if (errorMessage) {
    errors.username = errorMessage
  }
}
```

### Usage

```js
function getUser(req, res) {
  let errors = {}
  validateUsername(req.params.username, errors)
  if (errors.username) {
    res.status(400).json({ success: false, errors })
  }
  // ...
}
```

### With `validators`

```js
const validateUsername = composeAll([isDefined, isString, notEmpty, notShorterThan(3), notLongerThan(32), matchesAlphanumeric], "username")
```

### Usage

```js
function getUser(req, res) {
  let result = {}
  validateUsername(req.params.username, result)
  if (result.errors) {
    res.status(400).json({ success: false, errors: result.errors })
  }
  // ...
}
```

### Behind The Scenes

```js
const isDefined = createValidator(input => input !== undefined, "must be provided")

const isString = createValidator(input => typeof input === "string", "must be a string")

const notEmpty = createValidator(input => input.length !== 0, "cannot be empty")

const notShorterThan = length => createValidator(input => input.length >= length, `must have at least length ${length}`)

const notLongerThan = length => createValidator(input => input.length <= length, `must have at most length ${length}`)

const matches = (regex, message) => createValidator(input => regex.test(input), message)

const matchesAlphanumeric = matches(/^[a-zA-Z0-9]+$/, "must only contain alphanumeric characters")
```

## What about more complex logic?

### Typical validation code

```js
function validateActive(active, errors) {
  let errorMessage
  if (active === undefined) {
    errorMessage = "Active must be defined."
  }
  if (typeof active === "boolean") {
    return
  }
  if (typeof active === "string") {
    if (!/^true$|^1$|^yes$|^false$|^0$|^no$/i.test(active)) {
      errorMessage = "Active must be true/false, yes/no, or 1/0."
    }
  } else if (typeof active === "number") {
    if (![0, 1].includes(active)) {
      errorMessage = "Active must be either 0 or 1"
    }
  } else {
    errorMessage = "Active must be a boolean or a boolean-like string or number."
  }
  if (errorMessage) {
    errors.active = errorMessage
  }
}
```

### Usage

```js
function setUserActive(req, res) {
  let errors = {}
  validateUsername(req.params.username, errors)
  validateActive(req.body.active, errors)
  if (errors.username || errors.active) {
    res.status(400).json({ success: false, errors })
  }
  // ...
}
```

### With `validators`

```js
const validateActive = composeAny([isBoolean, isBooleanLikeString, isBooleanLikeNumber], "must be a boolean or a boolean-like string or number", "active")
```

### Usage

```js
function setUserActive(req, res) {
  let result = {}
  validateUsername(req.params.username, result)
  validateActive(req.body.active, result)
  if (result.errors) {
    res.status(400).json({ success: false, errors: result.errors })
  }
  // ...
}
```

### Behind The Scenes

```js
const isBoolean = createValidator(input => typeof input === "boolean", "must be a boolean")

const matchesBoolean = matches(/^true$|^1$|^yes$|^false$|^0$|^no$/i, "must be true/false, yes/no, or 1/0")

const isBooleanLikeString = composeAll([isString, matchesBoolean])

const isNumber = createValidator(input => typeof input === "number", "must be a number")

const isEither = (...values) => createValidator(input => values.includes(input), `must be either ${values.join(" or ")}`)

const isBooleanLikeNumber = composeAll([isNumber, isEither(0, 1)])
```

## What about asynchronous logic?

### Typical validation code

```js
function checkUsernameAvailable(username, errors) {
  const user = await User.findByUsername(username)
  if (user) {
    errors.errorMessage = "Username is already in use."
  }
}
```

### Usage

```js
async function registerUser(req, res) {
  let errors = {}
  validateUsername(req.params.username, errors)
  if (!errors.username) {
    await checkUsernameAvailable(req.params.username, errors)
  }
  if (errors.username) {
    res.status(400).json({ success: false, errors })
  }
  // ...
}
```

### With `validators`

```js
const checkUsernameAvailable = createAsyncValidator(User.findByUsername, "is already in use", "username")
```

### Usage

```js
function registerUser(req, res) {
  let result = {}
  validateUsername(req.params.username, result)
  if (!result.errors) {
    await checkUsernameAvailable(req.params.username, result)
  }
  if (result.errors) {
    res.status(400).json({ success: false, errors: result.errors })
  }
  // ...
}
```

