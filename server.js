'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.use(bodyParser.json({limit: 500000})); 
app.use(bodyParser.urlencoded({limit: 500000, extended: true}));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.get('/', (req, res) => {
  console.log(req.body);
  return res.status(200).json({
    "test": "success"
  });
})

app.post('/email', (req, res) => {
  console.log(req.body);
  nodemailer.createTestAccount((err, account) => {
      const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
              user: 'cjmt36fmscyccvoj@ethereal.email',
              pass: '6Jp6kWGQm9jA4FGHuA'
          }
      });

      // setup email data with unicode symbols
      let mailOptions = {
          from: 'req.body.name', // sender address
          to: 'kasey.l.labelle@gmail.com', // list of receivers
          subject: 'kaseyllabelle.com contact request', // Subject line
          text: req.body.name + '\n' + req.body.email + '\n' + req.body.tel + '\n' + req.body.message, // plain text body
          html: req.body.name + '\n' + req.body.email + '\n' + req.body.tel + '\n' + req.body.message // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
  });
  res.sendStatus(200);
});

let server;

function runServer(){
  const port = process.env.PORT || 8181;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

function closeServer(){
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err){
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module){
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};