import mailgun from 'mailgun-js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const PROVIDERS = {
  mailgun: async ({ to, subject, text, html }) => {
    const mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });

    const data = {
      from: process.env.MAILGUN_FROM,
      to,
      subject,
      text,
      html,
    };
    return new Promise((resolve, reject) => {
      mg.messages().send(data, (error, body) => {
        if (error) return reject(error);
        resolve(body);
      });
    });
  },

  smtp: async ({ to, subject, text, html }) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    };

    return transporter.sendMail(mailOptions);
  },
};

export const sendEmail = async (options) => {
  const provider = process.env.EMAIL_PROVIDER;
  const handler = PROVIDERS[provider];
  if (!handler) throw new Error(`Unsupported email provider: ${provider}`);

  return handler(options);
};
