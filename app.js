'use strict'

const Koa = require('koa');
const route = require('koa-route');

// const parse = require('co-body');
// // const render = require('./lib/render');
// const views = require('co-views');
const path = require('path');

const app = Koa();
// const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const VERIFY_TOKEN = 'quake_bot_verify_token';
/**
 * Setup middleware
 */

app.use(route.get('/', function* () {
    this.body = 'Hello'
}))
app.use(route.get('/webhook', hook));

/**
 * Setup route generators
 */
function* hook(req, res) {
    console.log('req hook', req)
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === VERIFY_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
};

app.listen(3000);
console.log(`Server running on port :3000`)