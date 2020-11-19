const transporter = require('../nodeMailer/nodeMailer');

const mailStructure = {
    from: 'qwekmailer@gmail.com',
    to: '',
    subject: 'Interview Scheduled',
    text: 'Your Interview is Scheduled find the details: \n\n'
};

exports.sendMail = (req, res) => {
    let mailFormat = mailStructure;
    mailFormat.to = req.body.participantsList.join(',');
    mailFormat.text += `Date: ${req.body.date} \n Time: ${req.body.time} \n Duration: ${req.body.duration}`;
    transporter.sendMail(mailFormat, function(error, info){
        if (error) {
          console.log(error);
          res.send({status: 0});
        } 
        else {
          console.log('Email sent: ' + info.response);
          res.send({
            status: 1,
            msg: 'Email(s) sent'
          });
        }
    }); 

}