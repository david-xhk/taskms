// import nodemailer from "nodemailer"

// export function sendEmail({ to, subject, text }) {
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS
//     }
//   })

//   const from = `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`

//   return transporter.sendMail({ from, to, subject, text })
// }
