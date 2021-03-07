/**
 * Powered by zydsoft™
 * 2021-3-5
 * zz
 */
const koa = require("koa")
const koaBody = require("koa-body")
const { initController, initService, initConfig, initSchedule } = require("./loader")

class zyd {
  constructor(conf) {
    this.$app = new koa(conf)
    this.$app.use(koaBody({
      multipart: true, // 支持文件上传
      encoding: 'gzip',
    }))
    //执行配置文件
    this.$plugin = initConfig(this) //返回plugin配置
    initSchedule()

    this.$service = initService()
    this.$controller = initController(this)
    this.$app.use(this.$controller.routes())
  }

  start(port, callBack = () => {
    console.log("start on port：" + port)
  }) {
    this.$app.listen(port, callBack)
  }
}

module.exports = zyd