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

app.listen(PORT);
console.log(`Server running on port : ${PORT}`)