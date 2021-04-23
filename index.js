/**
 * Powered by zydsoft™
 * 2021-3-5
 * zz
 */
const Koa = require("koa")
const { initController, initService, initConfig, initSchedule, initModel, initPlugin } = require("./loader")

class Zyd {
  constructor(conf) {
    this.$app = new Koa()
    //生命周期函数 - init前
    if (conf && conf.beforeInit) conf.beforeInit(this.$app)

    this.$global = {} //定义全局变量

    if (conf && conf.baseUrl) { // 复制全局变量得基础路径 zz 2021-4-23
      this.$global.baseUrl = conf.baseUrl
    }

    //init
    //执行配置文件
    this.$config = initConfig(this) //返回config配置
    this.$plugin = initPlugin(this)
    initSchedule(this)
    this.$service = initService(this)
    this.$model = initModel(this)
    this.$controller = initController(this)

    //生命周期函数 - init后 zz 2021-4-23
    if (conf && conf.afterInit) conf.afterInit(this.$app)

    this.$app.use(this.$controller.routes())
  }

  start(port = 3000, callBack = () => {
    console.log("start on port：" + port)
  }) {
    this.$app.listen(port, callBack)
  }
}

module.exports = Zyd