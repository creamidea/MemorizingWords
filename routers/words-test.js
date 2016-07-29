"use strict";

const fs = require('fs'),
      child_process = require('child_process'),
      path = require('path');
const router = require('koa-router')();

const DB_PATH = `${process.cwd()}/public/reviews`;

function exec (cmd, options) {
  const _exec = child_process.exec;
  return new Promise ( (resolve, reject) => {
    _exec(cmd, options, (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });
}

router.prefix('/words-test');

router.get('/content', function *(next) {
  let files = [];
  try {
    let dirText = yield exec('ls -al', {cwd: DB_PATH});
    for(var file of dirText.split(/\r?\n/)) {
      if (/\.txt/.test(file)) {
        files.push(file.split(/\s+/).slice(-5).join(' '));
      }
    };
  } catch(err) {
    this.body = {statue: 500, statusText: err.message};
    return
  }
  this.body = files;
});

router.get('/:content', function*(next){
  let content = this.params.content;
  this.body = 'h';
});

module.exports = router;
