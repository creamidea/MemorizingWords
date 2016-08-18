"use strict";

const router = require('koa-router')();

router.prefix('/server-status');

router.get('/time', function * () {
  let timestamp = 0;
  try {
    timestamp = Date.now();
  } catch (err) {
    this.statusCode = 500;
    this.body = err.message;
    return;
  }
  this.body = {data: timestamp};
});

module.exports = router;
