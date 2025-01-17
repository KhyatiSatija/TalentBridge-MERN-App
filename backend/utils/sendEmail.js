const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  var mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(
    mailOptions,
    function (error, info) {
      if (error) {
        console.log("Coudn't send the mail yar SAD", error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }
  );
};

module.exports = sendEmail;
