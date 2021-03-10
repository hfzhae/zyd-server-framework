## [github](https://github.com/hfzhae/zyd-server-framework)

## install
```
$ npm install -Save zyd-server-framework
```

```js
const Zsf = require("zyd-server-framework")
const app = new Zsf()
app.start(3000)
```

## config
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
  ]
  middleware: [
    "error",
    "favicon",
  ],
}
```

## controller
```js
module.exports = app => ({
  "get /"(){
    app.ctx.body = "首页"
  },
})
```
## service
```js
module.exports = app => ({
  getName() {
    return "userName"
  },
})
```

## middleware
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

```js
const mongoose = require("mongoose")
const schema = new mongoose.Schema({
  userName: { type: String },
  age: { type: Number }
})
module.exports = app => mongoose.model("user", schema)
```

## plugin
```js
module.exports = app => ({
  timestamp() {
    return parseInt(Date.parse(new Date) / 1000)
  },
})
```

## schedule
```js
module.exports = app => ({
  interval: "0 1 * * * *", //crontab格式
  handler() {
    console.log("这是一个定时任务")
  }
})
```