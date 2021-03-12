/**
 * Powered by zydsoft™
 * 2021-3-10
 * zz
 */
module.exports = dir => {
  const fs = require("fs")
  try {
    fs.accessSync(dir);
  } catch (e) {
    fs.mkdirSync(dir);
    switch (dir) {
      case "controller":
        fs.writeFileSync(`${dir}/home.js`, `
module.exports = app => ({
  "get /"(){
    app.ctx.body = "Hello World"
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
          console.log(`写入${dir}/home.js成功`);
        })
        break
      case "config":
        fs.writeFileSync(`${dir}/index.js`, `
module.exports = {
  db: [
    /* type: 'mongo' | 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */
    {
      type:"mongo",
      name:"mongo",
      options: {
          connect:"localhost:27017", //connect:"user:password@localhost:27017",
          dbName: "db",
      }
    },
    // {
    //   type:"mysql", 
    //   name:"mysql1",
    //   options: {
    //     dialect: "mysql",
    //     host: "localhost",
    //     database: "database",
    //     username: "root",
    //     password: "example"
    //   }
    // },
    // {
    //   type:"mssql",
    //   name:"mssql1",
    //   options: {
    //     dialect: "mssql",
    //     host: "localhost",
    //     database: "database",
    //     username: "sa",
    //     password: ""
    //   }
    // }
  ],
  middleware: [
    "error",
    "favicon",
    "callBack",
  ],
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
        fs.writeFileSync(`${dir}/callBack.js`, `
const Router = require('koa-router') // koa 路由中间件
const router = new Router(); // 实例化路由
const assert = require("http-assert")
        
module.exports = (router.post("/callBack:id", async ctx => {
  const id = ctx.params.id
  assert(id, 400, "缺少id")
  ctx.body = "中间件前置路由"
})).routes()
        `, function (error) {
          if (error) {
            console.log(error);
            return false;
          }
          console.log(`${dir}/callBack.js成功`);
        })
        break
      case "model":
        fs.writeFileSync(`${dir}/user.js`, `
const mongoose = require("mongoose")
const schema = new mongoose.Schema({
  userName: { type: String },
  age: { type: Number }
})
module.exports = app => app.$config.db.mongo.model("user", schema)
        `, function (error) {
          if (error) {
            console.log(error);
            return false;
          }
          console.log(`${dir}/user.js成功`);
        })
        break
      case "plugin":
        fs.writeFileSync(`${dir}/utils.js`, `
module.exports = app => ({
  timestamp() {
    return parseInt(Date.parse(new Date) / 1000)
  },
  randomNum(n){
    const range = function (start, end) {
      var array = [];
      for (var i = start; i < end; ++i) array.push(i);
      return array;
    }
    return range(0, n).map((x) => {
      return Math.floor(Math.random() * 10);
    }).join('')
  }
})
          `, function (error) {
          if (error) {
            console.log(error);
            return false;
          }
          console.log(`${dir}/utils.js成功`);
        })
        break
    }
  }
}