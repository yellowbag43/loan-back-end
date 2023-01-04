const nodemailer = require('nodemailer');
require('dotenv/config');

const appPassword= process.env.google-app-password
const emailID = process.env.email

var hbs = require('nodemailer-express-handlebars');

var options = {
             
    viewEngine: {
                     
        extname: '.hbs',
        defaultLayout : 'template',
        layoutsDir: 'views/email/',                        
        partialsDir : 'views/partials/'
    },
                 
    viewPath: 'views/email/',
                 
    extName: '.hbs'
};

module.exports = class emails {
async  sendmail(mailOptions2)
{
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: emailID,
        pass: appPassword
      }
  });

  transporter.use('compile', hbs(options));

  var mailOptions = {
    to: 'muthupillai@hotmail.com',
    from: 'schoolapp72@gmail.com',
    subject: 'password reset!',
    template: 'email_body',
    context: {
        variable1 : 'value1',
        variable2 : 'value2'
    }
//    text: "<html lang='en'><head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>Document</title></head><body><h1>My first email in HTML</h1></body></html>"
  };
 
  await transporter.sendMail(mailOptions2, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
}
