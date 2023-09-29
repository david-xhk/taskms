export default function parseRequest(source, args) {
  return async function parseRequestInner(req, res, next) {
    for (let [key, parser] of Object.entries(args)) {
      if (req[source][key] !== undefined) {
        try {
          req[source][key] = await parser(req[source][key])
        } catch (err) {
          return next(err)
        }
      }
    }
    next()
  }
}
