# [zyd-server-framework](https://github.com/hfzhae/zyd-server-framework)

## Installation
```
$ npm install -Save zyd-server-framework
```

```js
const Zsf = require("zyd-server-framework")
const app = new Zsf() // new Zsf({ cors: true })
app.start(3000)
```

## config
>/config/conf.js

```js
module.exports = {
  db: [
    {
      type:"mongo",
      options: {
          user: "user",
          pass: "",
          port: 27017,
          host: "localhost",
          dbName: "db",
          replicaSet: "",
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

## model
>/model/user.js

```js
const mongoose = require("mongoose")
const schema = new mongoose.Schema({
  userName: { type: String },
  age: { type: Number }
})
module.exports = app => (["mongo", mongoose.model("user", schema)]) //'mongo' | 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一
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

## License
[MIT](https://github.com/hfzhae/zyd-server-framework/blob/master/LICENSE)