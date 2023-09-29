import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import express, { json as bodyParser, urlencoded as urlEncodedParser } from "express"
import { existsSync } from "node:fs"

import db from "@han-keong/tms-db"
import { authentication, authorization } from "./middlewares/authMiddleware.js"
import errorHandler, { ErrorMessage } from "./middlewares/errorHandler.js"
import { logRequest } from "./middlewares/logRequest.js"
import authRouter from "./routes/authRouter.js"
import groupsRouter from "./routes/groupsRouter.js"
import projectRouter from "./routes/projectRouter.js"
import projectsRouter from "./routes/projectsRouter.js"
import userRouter from "./routes/userRouter.js"
import usersRouter from "./routes/usersRouter.js"

// Initialize the server
process.on("uncaughtException", err => {
  console.log("Shutting down due to uncaught exception:")
  console.log(err)
  process.exit(1)
})

if (existsSync(".env")) {
  console.log("Loading environment variables from file: .env")
  dotenv.config({ path: ".env" })
}

db.connect({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 100,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
})

const app = express()

// Middleware for logging requests
app.use(logRequest)

// Middleware for handling security headers
app.use(cors({ origin: process.env.WEB_BASE_URL, credentials: true }))

// Middleware for parsing requests
app.use(bodyParser())

app.use(urlEncodedParser({ extended: true }))

app.use(cookieParser())

// Middleware for routing requests
app.get("/api", function redirectToPostmanCollection(req, res) {
  res.redirect(process.env.POSTMAN_COLLECTION_URL)
})

app.get("/api/ip", (req, res) => res.send(req.ip))

app.use("/api/auth", authRouter)

app.use("/api/*", authentication)

app.use("/api/groups", groupsRouter)

app.use("/api/project", projectRouter)

app.use("/api/projects", projectsRouter)

app.use("/api/user", userRouter)

app.use("/api/users", authorization("admin"), usersRouter)

app.all("*", function unknownRoutes(req, res, next) {
  next(new ErrorMessage(`Route not found: ${req.method} ${req.originalUrl}`, 404))
})

// Middleware for handling errors
app.use(errorHandler)

// Start the server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

process.on("unhandledRejection", err => {
  console.log("Shutting down the server due to promise rejection caused by error:")
  console.log(err)
  server.close(() => {
    process.exit(1)
  })
})
