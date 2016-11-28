'use strict'

const Koa = require('koa');
const router = require('koa-router')();
const path = require('path');
const koaBody = require('koa-body')();
const request = require('request')
const handlers = require('./handlers/quakes');

const app = Koa();
// const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = 'quake_bot_verify_token';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
/**
 * Setup middleware
 */
router.get('/', function* (next) {
  this.body = 'Hello, Root'
});
router.get('/webhook', hook);
router.get('/quakedata', handlers.getQuakeData);
router.post('/webhook', koaBody, hookPost)

app
  .use(router.routes())
  .use(router.allowedMethods())

/**
 * Setup route generators
 */
function* hook(hub) {
  const req = this.request

  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log("Validating webhook");
    this.response.status = 200;
    this.response.body = req.query['hub.challenge'];
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    this.response.status = 403;
  }
};

function* hookPost(next) {
  const req = this.request;
  const data = this.request.body;
  console.log('BODY', this.request.body);
  console.log('\n\nrequest', req);


  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    this.response.status = 200;
  }
};

function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  console.log("Message data: ", event.message);
  const senderID = event.sender.id;
  const recipientID = event.recipient.id;
  const timeOfMessage = event.timestamp;
  const message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  const messageId = message.mid;

  const messageText = message.text;
  const messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendTextMessage(senderID, "This is so Generic");
        break;
      case 'quake':
        sendQuakeMessage(senderID)
        sendTextMessage(senderID, "Getting Quake Data…")
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
}

function sendQuakeMessage(recipientId) {
      handlers.getQuakeData().then((data) => {
        console.log('Data from quake', data);
        let latest = data.features[0];
        let count = latest.count;
        let title = latest.title;
        // construct a quake message from data
        let countMessageText = `in the last 24 hours there have been ${count} earthquakes`;
        let latestMessageText = `The latest earthquake was: ${title}`;

        //send message to user
        sendTextMessage(recipientId, countMessageText);
        sendTextMessage(recipientId, latestMessageText);
      })
}

function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}

/**
 * Sends message through SendAPI.
 * @param {any} messageData
 */
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let recipientId = body.recipient_id;
      let messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });
}

/**
 * Server Startup.
 */
app.listen(PORT);
console.log(`Server running on port : ${PORT}`)