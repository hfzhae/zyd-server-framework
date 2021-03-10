# [zyd-server-framework](https://github.com/hfzhae/zyd-server-framework)

## Installation
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
/config/conf.js

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

app.$config.conf.db
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
/service/user.js

module.exports = app => ({
  getName() {
    return "userName"
  },
})

app.$service.user.getName()
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
/model/user.js

const mongoose = require("mongoose")
const schema = new mongoose.Schema({
  userName: { type: String },
  age: { type: Number }
})
module.exports = app => mongoose.model("user", schema)

app.$model.user
```

## plugin
```js
/plugin/utils.js

module.exports = app => ({
  timestamp() {
    return parseInt(Date.parse(new Date) / 1000)
  },
})

app.$plugin.utils.timestamp()
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

## License
[MIT](https://github.com/hfzhae/zyd-server-framework/blob/master/LICENSE)