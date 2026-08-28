const nodemailer = require("nodemailer");
const logger = require("../config/logger");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined,
});

const sendMail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || "BeYuumi <noreply@beyuumi.com>",
    to,
    subject,
    html,
  });
  logger.info(`Email sent: ${info.messageId}`);
  // Ethereal preview URL for dev
  if (!process.env.SMTP_USER) {
    logger.info(`Preview: ${nodemailer.getTestMessageUrl(info)}`);
  }
  return info;
};

module.exports = { sendMail };
