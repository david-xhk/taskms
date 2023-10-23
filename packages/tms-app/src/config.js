export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:4000",
  API_TIMEOUT_MS: Number.parseInt(process.env.API_TIMEOUT_MS || "5000"),
  SYNC_INTERVAL_MS: Number.parseInt(process.env.SYNC_INTERVAL_MS || "60000"),
  VALIDATION_DELAY_MS: Number.parseInt(process.env.VALIDATION_DELAY_MS || "800")
}
