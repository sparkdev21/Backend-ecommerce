const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (email, subject, text) => {
  try {
    email;
    subject;
    text;
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    transporter;
    const mail = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: `Visit the given link to reset your password \n${text}`,
    });
    ("Email sent successfully");
  } catch (error) {
    ("Given email doesn't exists");
  }
};
