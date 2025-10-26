const nodemailer = require("nodemailer");

exports.sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "smtp.zoho.com", // or your SMTP provider
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"NotesVerse Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};
