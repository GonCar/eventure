const nodemailer = require('nodemailer');
const MAILER_USER = process.env.MAILER_USER || 'enterpriseeventure@gmail.com';
const MAILER_PW = process.env.MAILER_PW || 'enterpriseeventure18';

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: MAILER_USER,
    pass: MAILER_PW
  }
});

module.exports = transport;
