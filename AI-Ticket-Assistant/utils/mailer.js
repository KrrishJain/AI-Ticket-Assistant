import nodemailer from "nodemailer";

export const sendMail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMPT_HOST,
      port: process.env.MAILTRAP_SMPT_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_SMPT_USER,
        pass: process.env.MAILTRAP_SMPT_PASS,
      },
    });

    (async () => {
      const info = await transporter.sendMail({
        from: '"Inngest TM',
        to,
        subject,
        text, // plain‑text body
      });

      console.log("Message sent:", info.messageId);
      return info
    })();
  } catch (error) {
    console.log("Mail error", error);
    throw error
  }
};
