import dotenv from "dotenv"
import { existsSync } from "node:fs"

if (process.env.NODE_ENV === "development" && existsSync(".env")) {
  console.log("Loading environment variables from file: .env")
  dotenv.config({ path: ".env" })
}

export default {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: process.env.PORT || "4000",

  DB_HOST: process.env.DB_HOST || "127.0.0.1",
  DB_USER: process.env.DB_USER || "test",
  DB_PASSWORD: process.env.DB_PASSWORD || "test",
  DB_DATABASE: process.env.DB_DATABASE || "tms",

  SMTP_HOST: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  SMTP_PORT: Number.parseInt(process.env.SMTP_PORT || "2525"),
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || "noreply@tms.com",
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || "Task Management System",

  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_TIME: process.env.JWT_EXPIRES_TIME || "7d",
  COOKIE_EXPIRES_DAYS: Number.parseInt(process.env.COOKIE_EXPIRES_DAYS || "7"),

  POSTMAN_COLLECTION_URL: process.env.POSTMAN_COLLECTION_URL || "https://documenter.getpostman.com/view/29372953/2s9YBz4bBc",

  WEB_BASE_URL: process.env.WEB_BASE_URL || "http://localhost:3000"
}
