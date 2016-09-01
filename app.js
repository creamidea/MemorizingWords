const koa = require('koa')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const app = koa()
const debug = require('debug')('dev')
const path = require('path')

const wordsTestRouter = require('./routers/words-test')
const serverStatusRouter = require('./routers/server-status')

const PORT = process.env.PORT || 3000
const PUBLIC_PATH = path.resolve(__dirname, 'public')

module.global = {
  PUBLIC_PATH: PUBLIC_PATH
}

app.use(logger())
app.use(koaStatic(PUBLIC_PATH))
app.use(bodyParser())

app.use(wordsTestRouter.routes())
app.use(wordsTestRouter.allowedMethods())
app.use(serverStatusRouter.routes())
app.use(serverStatusRouter.allowedMethods())

// app.use(function *() {
//   this.body = 'Hello, world!';
// });

app.listen(PORT, () => {
  debug(`Server listen ${PORT}`)
})
