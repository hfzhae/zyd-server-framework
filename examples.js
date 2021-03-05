module.exports = dir => {
  const fs = require("fs")
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
      case "model":
        fs.writeFileSync(`${dir}/user.js`, `
const mongoose = require("mongoose")
const schema = new mongoose.Schema({
  userName: { type: String },
  age: { type: Number }
})
module.exports = mongoose.model("user", schema)
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
}