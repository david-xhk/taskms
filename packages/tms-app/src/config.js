export default {
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:4000",
  VALIDATION_DELAY_MS: Number.parseInt(process.env.VALIDATION_DELAY_MS || "800")
}
