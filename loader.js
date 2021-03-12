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
      let [method, path] = key.split(" ")
      path = path === "/" ? "" : path // 末尾无斜杠也能访问路由
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
  config["db"] = {}
  load("config", (filename, conf) => {
    config[filename] = {}
    Object.keys(conf).forEach(item => config[filename][item] = conf[item])
    //数据库
    if (conf.db) {
      conf.db.forEach(item => {
        switch (item.type) {
          case "mongo":
            const mongoose = require("mongoose")
            const db = mongoose.createConnection(`mongodb://${item.options.connect}`, {
              useCreateIndex: true,
              useFindAndModify: false,
              useNewUrlParser: true,
              useUnifiedTopology: true,
              dbName: item.options.dbName
            })
            db.on("connected", () => {
              console.log('mongodb connect success')
            })
            db.on("error", () => {
              console.log('mongodb connect error')
            })
            db.on("disconnected", () => {
              console.log('mongodb connect disconnected')
            })
            config.db[item.name] = db
            break
          case "mssql": case "mariadb": case "postgres": case "mssql":
            const Sequelize = require("sequelize")
            config.db[item.name] = new Sequelize(item.options)
            break
        }
      })
    }
    // 中间件
    if (conf.middleware) {
      conf.middleware.forEach(mid => {
        console.log(`正在加载中间件: ${mid}`)
        const midPath = path.relative(__dirname, "middleware") + "/" + mid
        let middle = require(midPath)
        middle = middle.length == 1 ? middle(app) : middle // 中间件柯里化
        app.$app.use(middle)
      })
    }
  })
  return config
}

//定时器
function initSchedule(app) {
  const schedule = require("node-schedule")
  load("schedule", (filename, schduleConfig) => {
    console.log(`正在启动定时器: ${filename}`)
    const conf = typeof schduleConfig === "function" ? schduleConfig(app) : schduleConfig  // 支持柯里化
    schedule.scheduleJob(conf.interval, conf.handler)
  })
}

// model
function initModel(app) {
  const models = {}
  load("model", (filename, model) => {
    console.log(`正在加载模型: ${filename}`)
    models[filename] = model(app)
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