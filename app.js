'use strict'

const Koa = require('koa');
const router = require('koa-router')();
const path = require('path');

const app = Koa();
// const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = 'quake_bot_verify_token';

/**
 * Setup middleware
 */
router.get('/', function* (next) {
  this.body = 'Hello, Root'
});
router.get('/webhook', hook);

app.use(router.routes())
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

router.post('/webhook', function* () {
  const req = this.request;
  const data = req.body;
  console.log('request', req);
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
});

function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  console.log("Message data: ", event.message);
}

app.listen(PORT);
console.log(`Server running on port : ${PORT}`)