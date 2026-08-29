import nodemailer from 'nodemailer';

const getTransport = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) throw Object.assign(new Error('Email service is not configured'), { statusCode: 503 });
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });
};

export const sendPasswordResetEmail = async ({ email, name, token }) => {
  const resetUrl = `${process.env.CLIENT_URL?.split(',')[0] || 'http://localhost:5173'}/reset-password/${token}`;
  await getTransport().sendMail({
    from: process.env.EMAIL_FROM || 'FreshBasket <no-reply@freshbasket.local>',
    to: email,
    subject: 'Reset your FreshBasket password',
    text: `Hello ${name}, reset your password using this link: ${resetUrl}. This link expires in 15 minutes.`,
    html: `<p>Hello ${name},</p><p>Reset your FreshBasket password using the link below. It expires in 15 minutes.</p><p><a href="${resetUrl}">Reset password</a></p>`,
  });
};
