// Philip
import nodemailer from 'nodemailer';

import { emailEnums } from '../enums/emailEnums.js';

const sendAutomatedEmail = (subject, message, recipients) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  if (recipients == null || recipients == undefined || recipients.length == 0) return emailEnums.NO_EMAILS_TO_SEND;

  const email = {
    from: process.env.EMAIL_ADDRESS,
    to: recipients.join(','),
    subject: subject,
    text: message
  }

  transporter.sendMail(email, (error, info) => {
    if (error) {
      console.log(error);
      return emailEnums.UNABLE_TO_SEND_EMAILS
    }
    return emailEnums.SUCCESSFULLY_SENT_EMAILS;
  })
}

export default sendAutomatedEmail;
