import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ================= RESET PASSWORD EMAIL ================= */
export async function sendResetPasswordEmail(
  to: string,
  resetUrl: string
) {
  await transporter.sendMail({
    from: `"Admin Panel" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset your admin password",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
}

/* ================= VERIFY EMAIL (NEW) ================= */
export async function sendVerifyEmail(
  to: string,
  token: string
) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Admin Panel" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your email address",
    html: `
      <p>You requested to change your email.</p>
      <p>Please verify your new email address by clicking below:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}