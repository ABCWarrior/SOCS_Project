import nodemailer from 'nodemailer';

import { emailEnums } from '../enums/emailEnums.js';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
})

const sendAutomatedEmail = (subject, message, recipients) => {
  if (recipients == null || recipients == undefined || recipients.length == 0) return emailEnums.NO_EMAILS_TO_SEND;

  const email = {
    from: process.env.EMAIL_ADDRESS,
    to: recipients.join(','),
    subject: subject,
    text: message
  }


  transporter.sendMail(email, (error) => {
    return !error ? emailEnums.SUCCESSFULLY_SENT_EMAILS : emailEnums.UNABLE_TO_SEND_EMAILS;
  })
}

export default sendAutomatedEmail;
