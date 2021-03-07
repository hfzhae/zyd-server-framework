/**
 * Powered by zydsoft™
 * 2021-3-5
 * zz
 */
const fs = require("fs")
const path = require("path")
const Router = require("koa-router")

//读取指定目录文件
function load(dir, cb) {
  const url = path.relative(__dirname, dir)
  require("./examples")(dir) //加载示例文件
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
  const plugin = {}
  load("config", (filename, conf) => {
    //数据库
    if (conf.db) {
      conf.db.forEach(item => {
        switch (item.type) {
          case "mongo":
            const mongoose = require("mongoose")
            let replicaSet = item.options.replicaSet
            replicaSet = replicaSet ? "?replicaSet=" + replicaSet : ""
            mongoose.connect(`mongodb://${item.options.user}:${item.options.pass}@${item.options.host}:${item.options.port}/${replicaSet}`, {
              useCreateIndex: true,
              useFindAndModify: false,
              useNewUrlParser: true,
              useUnifiedTopology: true,
              dbName: item.options.dbName
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
            break
          case "mysql": break
          case "mssql": break
        }
      })

    }
    // model
    app.$model = {}
    load("model", (filename, model) => {
      app.$model[filename] = model
    })
    // 中间件
    if (conf.middleware) {
      conf.middleware.forEach(mid => {
        const midPath = path.relative(__dirname, "middleware") + "/" + mid
        app.$app.use(require(midPath))
      })
    }
    if (conf.plugin) {
      Object.keys(conf.plugin).forEach(item => plugin[item] = conf.plugin[item])
    }
  })
  return plugin
}

function initSchedule() {
  const schedule = require("node-schedule")
  load("schedule", (filename, schduleConfig) => {
    const conf = schduleConfig()
    schedule.scheduleJob(conf.interval, conf.handler)
  })
}

module.exports = { initController, initService, initConfig, initSchedule }