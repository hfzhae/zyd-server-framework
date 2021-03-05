const fs = require("fs")
const path = require("path")
const Router = require("koa-router")

//读取指定目录文件
function load(dir, cb) {
  const url = path.relative(__dirname, dir)
  try {
    fs.accessSync(dir);
  } catch (e) {
    fs.mkdirSync(dir);
    switch (dir) {
      case "controller":
        fs.writeFileSync(`${dir}/index.js`, `
module.exports = app => ({
  "get /"(){
    app.ctx.body = "首页"
  },
  "get /user": async () =>{ 
    app.ctx.body = await app.$service.user.getName()
  }
})
        `, function (error) {
          if (error) {
            console.log(error);
            return false;
          }
          console.log(`写入${dir}/index.js成功`);
        })
        break
      case "config":
        fs.writeFileSync(`${dir}/index.js`, `
module.exports = {
  // mongo: {
  //   user: "user",
  //   pass: "",
  //   port: 27017,
  //   host: "localhost"
  // },
  middleware: [
    "error",
    "favicon",
  ]
}
        `, function (error) {
          if (error) {
            console.log(error);
            return false;
          }
          console.log(`写入${dir}/index.js成功`);
        })
        break
      case "schedule":
        fs.writeFileSync(`${dir}/index.js`, `
module.exports = app => ({
  interval: "0 1 * * * *", //crontab格式
  handler() {
    console.log("这是一个定时任务")
  }
})
        `, function (error) {
          if (error) {
            console.log(error);
            return false;
          }
          console.log(`写入${dir}/index.js成功`);
        })
        break
      case "service":
        fs.writeFileSync(`${dir}/user.js`, `
const delay = (data, tick) => new Promise(resolve => {
  setTimeout(() => {
    resolve(data)
  }, tick);
})

module.exports = {
  getName() {
    return delay("zyd", 1000)
  },
}
        `, function (error) {
          if (error) {
            console.log(error);
            return false;
          }
          console.log(`写入${dir}/user.js成功`);
        })
        break
      case "middleware":
        fs.writeFileSync(`${dir}/error.js`, `
module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    const code = err.status || 500
    const message = err.message
    ctx.body = {
      code,
      message
    }
    ctx.status = code // 200
  }
}
        `, function (error) {
          if (error) {
            console.log(error);
            return false;
          }
          console.log(`${dir}/error.js成功`);
        })
        fs.writeFileSync(`${dir}/favicon.js`, `
module.exports = async (ctx, next) => {
  if (ctx.path === "/favicon.ico") {
    ctx.body = ""
    return
  }
  await next()
}
        `, function (error) {
          if (error) {
            console.log(error);
            return false;
          }
          console.log(`${dir}/favicon.js成功`);
        })
        break
    }
  }
  const files = fs.readdirSync(dir)
  files.forEach(filename => {
    filename = filename.replace(".js", "")
    const file = require("./" + url + "/" + filename)
    cb(filename, file)
  })
}

function initController(app) {
  const router = new Router()
  load("controller", (filename, routes) => {
    //路由的前缀
    const prefix = filename === "index" ? "" : `/${filename}`

    routes = typeof routes === "function" ? routes(app) : routes

    Object.keys(routes).forEach(key => {
      const [method, path] = key.split(" ")
      console.log(`正在映射地址: ${method.toLocaleUpperCase()} ${prefix}${path}`)
      router[method](prefix + path, async ctx => {
        app.ctx = ctx
        await routes[key](app)
      })
    })
  })
  return router
}

function initService() {
  const services = {}
  load("service", (filename, service) => {
    services[filename] = service
  })
  return services
}

function initConfig(app) {
  load("middleware", (filename, conf) => { })
  load("config", (filename, conf) => {
    if (conf.mongo) {
      const mongoose = require("mongoose")
      conf.mongo.host = process.env._pm2_version ? 'mongo-public-service' : conf.mongo.host //使用pm2即认为是生产环境
      mongoose.connect(`mongodb://${conf.mongo.user}:${conf.mongo.pass}@${conf.mongo.host}:${conf.mongo.port}/`, {
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'publicService'
      })
      mongoose.connection.on("connected", () => {
        console.log('mongodb connect success')
      })
      mongoose.connection.on("error", () => {
        console.log('mongodb connect error')
      })
      mongoose.connection.on("disconnected", () => {
        console.log('mongodb connect disconnected')
      })
      app.$model = {}
      load("model", (filename, model) => {
        app.$model[filename] = model
      })
    }
    // 中间件
    if (conf.middleware) {
      conf.middleware.forEach(mid => {
        const midPath = path.relative(__dirname, "middleware") + "/" + mid
        app.$app.use(require(midPath))
      })
    }
  })
}

function initSchedule() {
  const schedule = require("node-schedule")
  load("schedule", (filename, schduleConfig) => {
    const conf = schduleConfig()
    schedule.scheduleJob(conf.interval, conf.handler)
  })
}

module.exports = { initController, initService, initConfig, initSchedule }