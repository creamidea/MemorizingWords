"use strict";

const os = require('os'),
      fs = require('fs'),
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
function writeDB (title, article) {
  return new Promise ( (resolve, reject) => {
    fs.writeFile(`${DB_PATH}/${title}.txt`, article, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

router.prefix('/words-test');

router.get('/content', function *(next) {
  let files = [];
  // Now, just support linux
  if (/windows/i.test(os.type())) {
    this.body = "Now, just support for linux.";
    return;
  }
  try {
    let dirText = yield exec('ls -al', {cwd: DB_PATH});
    for(var file of dirText.split(/\r?\n/)) {
      if (/\.txt/.test(file)) {
        files.push(file.split(/\s+/).slice(-5).join(' '));
      }
    };
  } catch(err) {
    this.statusCode = 500;
    this.body = err.message;
    return;
  }
  this.body = files;
});

router.get('/order/:filename', function*(next){
  let filename = this.params.filename, stdout;
  try {
    stdout = yield exec(`node ${process.cwd()}/libs/google-translate.js ${filename}.txt`, {cwd: DB_PATH});
  } catch (err) {
    this.statusCode = 500;
    this.body = err.message;
    return;
  }
  this.body = stdout;
});

router.get('/:content', function*(next){
  let content = this.params.content;
  this.body = 'h';
});

router.post('/words', function *(next) {
  let status = 200, statusText = "";
  try {
    var {title, article} = this.request.body;
    yield writeDB(title, article);
  } catch (err) {
    this.statusCode = 500;
    this.body = err.message;
  }
  this.body = 'success';
});

module.exports = router;
