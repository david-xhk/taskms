import nodemailer from "nodemailer"

import config from "../config.js"

export function sendEmail({ to, subject, text }) {
  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: false,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS
    }
  })

  const from = `${config.SMTP_FROM_NAME} <${config.SMTP_FROM_EMAIL}>`

  return transporter.sendMail({ from, to, subject, text })
}
