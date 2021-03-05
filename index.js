const koa = require("koa")
const { initController, initService, initConfig, initSchedule } = require("./loader")

class zyd {
  constructor(conf) {
    this.$app = new koa(conf)

    //执行配置文件
    initConfig(this)
    initSchedule()
    
    this.$service = initService()
    this.$ctrl = initController(this)
    this.$app.use(this.$ctrl.routes())
  }

  start(port, callBack = () => {
    console.log("start on port：" + port)
  }) {
    this.$app.listen(port, callBack)
  }
}

module.exports = zyd