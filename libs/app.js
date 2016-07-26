const koa = require('koa'),
      koaStatic = require('koa-static'),
      app = koa(),
      debug = require('debug')('dev');

const PORT = process.env.PORT || 3000,
      PUBLIC_PATH = `${__dirname}/public`;

app.use(koaStatic(PUBLIC_PATH));

app.use(function *() {
  this.body = 'Hello, world!';
});

app.listen(PORT, () => {
  debug(`Server listen ${PORT}`);
});
