const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const app = express();

// how to know what config
nunjucks.configure('templates', {
  autoescape: true,
  express: app
});

// allow both form-encoded and json body parsing
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//twilio auth
const accountSid = 'AC32103116449f6035bc7707ebb464934f'; // Your Account SID from www.twilio.com/console
const authToken = 'd3c28f773a6a3fd8bccdffc264096924'; // Your Auth Token from www.twilio.com/console
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;

//twilio app send message to your phone
app.post('/twilio/send', async function postMsg(req, res, next) {
  try {
    const message = await client.messages.create({
      body: 'Hello from Node',
      to: '+12672553439', // Text this number
      from: '+14158517471' // From a valid Twilio number
    });
    //console.log(message);
    return res.json({ message });
  } catch (error) {
    next(error);
  }
});

// receive inbound messages
app.post('/twilio/receive', (req, res, next) => {
  const twiml = new MessagingResponse();
  twiml.message('you got a message!');
  // res.writeHead(200, { 'content-Type': 'text/xml' });
  console.log('twimil', twiml.toString());
  console.log('res', res);
  const msgNotice = twiml.toString();
  // return res.json({ msgNotice });
  return res.render('receive.html', { msgNotice });
});

// reply to the inbound messages with twilio helper function
app.listen(3000, () => {
  console.log('listening on 3000!');
});
