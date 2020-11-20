var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'qwekmailer@gmail.com',
    pass: 'qwekInterview'
  }
});

module.exports = transporter;