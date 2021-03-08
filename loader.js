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
    // filename = filename === "index" ? "" : `/${filename}`
    filename = "/" + filename
    routes = typeof routes === "function" ? routes(app) : routes // 支持柯里化
    Object.keys(routes).forEach(key => {
      const [method, path] = key.split(" ")
      console.log(`正在映射地址: ${method.toLocaleUpperCase()} ${filename}${path}`)
      router[method](filename + path, async ctx => {
        app.ctx = ctx
        await routes[key](app)
      })
    })
  })
  return router
}

function initService(app) {
  const services = {}
  load("service", (filename, service) => {
    console.log(`正在加载服务: ${filename}`)
    service = typeof service === "function" ? service(app) : service  // 支持柯里化
    services[filename] = service
  })
  return services
}

function initConfig(app) {
  load("middleware", (filename, conf) => { })
  const config = {}
  load("config", (filename, conf) => {
    config[filename] = {}
    Object.keys(conf).forEach(item => config[filename][item] = conf[item])
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
    // 中间件
    if (conf.middleware) {
      conf.middleware.forEach(mid => {
        console.log(`正在加载中间件: ${mid}`)
        const midPath = path.relative(__dirname, "middleware") + "/" + mid
        app.$app.use(require(midPath))
      })
    }
  })
  return config
}

//定时器
function initSchedule(app) {
  const schedule = require("node-schedule")
  load("schedule", (filename, schduleConfig) => {
    const conf = schduleConfig(app)
    schedule.scheduleJob(conf.interval, conf.handler)
  })
}

// model
function initModel(app) {
  const models = {}
  load("model", (filename, model) => {
    console.log(`正在加载模型: ${filename}`)
    // model = typeof model === "function" ? model(app) : model // 支持柯里化
    models[filename] = model
  })
  return models
}

//plugin
function initPlugin(app) {
  const plugins = {}
  load("plugin", (filename, plugin) => {
    console.log(`正在加载插件: ${filename}`)
    plugin = typeof plugin === "function" ? plugin(app) : plugin // 支持柯里化
    plugins[filename] = plugin
  })
  return plugins
}

module.exports = { initController, initService, initConfig, initSchedule, initModel, initPlugin }