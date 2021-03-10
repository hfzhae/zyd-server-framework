/**
 * Powered by zydsoft™
 * 2021-3-5
 * zz
 */
const Koa = require("koa")
const koaBody = require("koa-body")
const { initController, initService, initConfig, initSchedule, initModel, initPlugin } = require("./loader")

class Zyd {
  constructor(conf) {
    this.$app = new Koa()
    if(conf && conf.cors){
      this.$app.use(require('koa2-cors')())
    }
    this.$app.use(koaBody({
      multipart: true, // 支持文件上传
      encoding: 'gzip',
    }))
    //执行配置文件
    this.$config = initConfig(this) //返回config配置
    this.$plugin = initPlugin(this)
    initSchedule(this)

    this.$service = initService(this)
    this.$model = initModel(this)
    this.$controller = initController(this)
    this.$app.use(this.$controller.routes())
  }

  start(port, callBack = () => {
    console.log("start on port：" + port)
  }) {
    this.$app.listen(port, callBack)
  }
}

module.exports = Zyd