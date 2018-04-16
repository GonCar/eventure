const nodemailer = require('nodemailer');
const transport = require('../configs/mailer.config');
const FROM = process.env.MAILER_USER || 'enterpriseeventure@gmail.com';

module.exports.invite = (to, event, next) => {
  const subject = 'You have an event';
  const body = `
    <p>Click the link to see your plan and enjoy!!</p>
    <a href="https://eventure18.herokuapp.com/events/${
      event.slug
    }" style="font-size:20px"> ${event.location} </a>
    `;
  send(to, subject, body, next);
};

function send(to, subject, body, next) {
  options = {
    from: FROM,
    to: to,
    subject: subject,
    html: body
  };

  transport.sendMail(options, error => {
    if (error) {
      console.error(`Error sending an email: ${error}`);
    }
    if (typeof next !== 'undefined') {
      next(error);
    }
  });
}

module.exports.send = send;
