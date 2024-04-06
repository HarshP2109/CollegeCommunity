const nodemailer = require('nodemailer');

const fromMail = process.env.SEND_EMAIL

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: fromMail,
      pass: process.env.SEND_PASS
    }
  });



function sendMail(To, subject, bigMessage){
    let mailOptions = {
        from: fromMail,
        to: To,
        subject: subject,
        text: bigMessage
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendMail;