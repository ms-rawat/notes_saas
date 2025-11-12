const nodemailer = require("nodemailer");

exports.sendEmail = async ({ to, subject, text }) => {
  console.log(to,subject,text)
  const transporter = nodemailer.createTransport({
 host: 'smtp.gmail.com',
  port: 587,
  secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"NotesVerse Support" <${process.env.EMAIL_USERNAME }>`,
    to,
    subject,
    text,
  });
};
