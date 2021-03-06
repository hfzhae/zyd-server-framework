# [zyd-server-framework](https://github.com/hfzhae/zyd-server-framework)
<p>
  <a href="https://github.com/hfzhae/zyd-server-framework/blob/master/LICENSE"><img style="margin-right:5px;" src="https://img.shields.io/badge/license-MIT-grren.svg"></a>
  <img style="margin-right:5px;" src="https://img.shields.io/badge/koa-v2.13.1-blue.svg">
  <img style="margin-right:5px;" src="https://img.shields.io/badge/node-v14.16.1-orange.svg">
  <a href="https://www.npmjs.com/package/zyd-server-framework"><img style="margin-right:5px;" src="https://img.shields.io/badge/npm-passing-yellow.svg"></a>

</p>

## Installation
```
$ npm install -s zyd-server-framework
```

## Quickstart
```js
const Zsf = require("zyd-server-framework")
const app = new Zsf() 
/*
const app = new Zsf({ 
  baseUrl: "/api", // 基础路径设置
  beforeInit(koaApp){ // 生命周期函数 - 初始化前
    koaApp.use(require("koa-cors")()) // 跨域设置
    koaApp.use(require("koa-bodyparser")()) // body设置
    const session = require("koa-session") // session设置
    koaApp.keys = ["some secret hurr"]
    koaApp.use(session({
      key: "koa:sess",
      maxAge: 86400000,
      overwrite: true,
      httpOnly: true,
      signed: true,
      rolling: false,
      renew: false,
    }, koaApp))
  },
  afterInit(koaApp){ ... } // 生命周期函数 - 初始化后
})
*/
app.start(3000)
/*
app.start(3000, callBack(){
  console.log("start on port：3000")
})
*/
```

## config
>/config/conf.js

```js
module.exports = {
  db: [
    /* type: 'mongo' | 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */
    {
      type:"mongo", 
      name:"mongo",
      options: {
          connect:"user:password@localhost:27017",
          dbName: "db",
      }
    },
    {
      type:"mysql",
      name:"mysql1",
      options: {
        dialect: "mysql",
        host: "localhost",
        database: "database",
        username: "root",
        password: "example"
      }
    },
    {
      type:"mssql",
      name:"mssql1",
      options: {
        dialect: "mssql",
        host: "localhost",
        database: "database",
        username: "sa",
        password: ""
      }
    }
  ],
  middleware: [
    "error",
    "favicon",
  ],
}
```
```js
app.$config.conf.db
app.$config.conf.middleware
```

## controller
>/controller/home.js

```js
module.exports = app => ({
  "get /"(){
    app.ctx.body = "Hello World"
  },
})
```
[http://localhost:3000/home](http://localhost:3000/home)

## service
>/service/user.js

```js
module.exports = app => ({
  getName() {
    return "userName"
  },
})
```
```js
app.$service.user.getName()
```

## middleware
>/middleware/favicon.js

```js
module.exports = async (ctx, next) => {
  if (ctx.path === "/favicon.ico") {
    ctx.body = ""
    return
  }
  await next()
}
```
>/middleware/callBack.js

```js
const Router = require('koa-router')
const router = new Router();
const assert = require("http-assert")
        
module.exports = (router.get("/callBack/:id", async ctx => {
  const id = ctx.params.id
  assert(id, 400, "缺少id")
  ctx.body = "中间件前置路由"
})).routes()
```
[http://localhost:3000/callBack/1234567](http://localhost:3000/callBack/1234567)
>/middleware/homePage.js

```js
// 静态页面中间件
const static = require("koa-static")
const mount = require('koa-mount')
module.exports = app => mount('/homePage', static('./homePage'))
```
>/homePage/index.html

```html
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>homePage</title>
</head>
<body>
  <h3>zyd-server-framework</h3>
  <p><a href="https://www.npmjs.com/package/zyd-server-framework">https://www.npmjs.com/package/zyd-server-framework</a></p>
  <p><a href="https://github.com/hfzhae/zyd-server-framework">https://github.com/hfzhae/zyd-server-framework</a></p>
</body>
</html>
```
[http://localhost:3000/homePage](http://localhost:3000/homePage)

## model
>/model/user.js

```js
const mongoose = require("mongoose")
const schema = new mongoose.Schema({
  userName: { type: String },
  age: { type: Number }
})
module.exports = app => app.$config.db.mongo.model("user", schema)
```
```js
app.$model.user
```

## plugin
>/plugin/utils.js

```js
module.exports = app => ({
  timestamp() {
    return parseInt(Date.parse(new Date) / 1000)
  },
})
```
```js
app.$plugin.utils.timestamp()
```

## schedule
>/schedule/index.js

```js
module.exports = app => ({
  interval: "0 1 * * * *", //crontab格式
  handler() {
    console.log("这是一个定时任务")
  }
})
```

## dependencies
| Project               | NPM                             | 
| --------------------- | ------------------------------- | 
| http-assert           | <img style="margin-right:5px;" src="https://img.shields.io/badge/npm-v1.4.1-blue.svg">     |
| koa                   | <img style="margin-right:5px;" src="https://img.shields.io/badge/npm-v2.13.1-blue.svg"> | 
| koa-mount             | <img style="margin-right:5px;" src="https://img.shields.io/badge/npm-v4.0.0-blue.svg">   | 
| koa-router            | <img style="margin-right:5px;" src="https://img.shields.io/badge/npm-v10.0.0-blue.svg">   |
| mongoose              | <img style="margin-right:5px;" src="https://img.shields.io/badge/npm-v5.11.18-blue.svg">     |
| node-schedule         | <img style="margin-right:5px;" src="https://img.shields.io/badge/npm-v2.0.0-blue.svg">   |
| sequelize             | <img style="margin-right:5px;" src="https://img.shields.io/badge/npm-v6.5.0-blue.svg">   |

## License
[MIT](https://github.com/hfzhae/zyd-server-framework/blob/master/LICENSE)