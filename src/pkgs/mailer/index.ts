import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { appSettings } from "../../configs/config";
const mailerConfig = appSettings.smtp;
const transporter = nodemailer.createTransport({
  service: mailerConfig.service,
  auth: {
    user: mailerConfig.userName,
    pass: mailerConfig.password,
  },
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
});

export async function sendMail(
  to: string,
  subject: string,
  text?: string,
  html?: string
) {
  try {
    const info = await transporter.sendMail({
      from: mailerConfig.userName,
      to,
      subject,
      text,
      html,
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}
export const mailer = { transporter, sendMail };
