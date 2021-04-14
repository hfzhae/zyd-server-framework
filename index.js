/**
 * Powered by zydsoft™
 * 2021-3-5
 * zz
 */
const Koa = require("koa")
const bodyParser = require("koa-bodyparser")
const { initController, initService, initConfig, initSchedule, initModel, initPlugin } = require("./loader")

class Zyd {
  constructor(conf) {
    this.$app = new Koa()
    if(conf && conf.cors){
      this.$app.use(require('koa-cors')())
    }
    this.$app.use(bodyParser())
    //前置回调
    if(conf && conf.callBack){
      conf.callBack(this.$app)
    }
    //执行配置文件
    this.$config = initConfig(this) //返回config配置
    this.$plugin = initPlugin(this)
    initSchedule(this)
    this.$global = {} //定义全局变量
    if(conf && conf.baseUrl){
      this.$global.baseUrl = conf.baseUrl
    }
    
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