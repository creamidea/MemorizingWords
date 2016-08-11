const koa = require('koa'),
      koaStatic = require('koa-static'),
      bodyParser = require('koa-bodyparser'),
      logger = require('koa-logger'),
      app = koa(),
      debug = require('debug')('dev');

const wordsTestRouter = require('./routers/words-test');

const PORT = process.env.PORT || 3000,
      PUBLIC_PATH = `${__dirname}/public`;

module.global = {
  PUBLIC_PATH: PUBLIC_PATH
};

app.use(logger());
app.use(koaStatic(PUBLIC_PATH));
app.use(bodyParser());

app.use(wordsTestRouter.routes());
app.use(wordsTestRouter.allowedMethods());

// app.use(function *() {
//   this.body = 'Hello, world!';
// });

app.listen(PORT, () => {
  debug(`Server listen ${PORT}`);
});
