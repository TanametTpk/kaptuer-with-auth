let kap = require('./index')
const kaptuer = require('kaptuer-open-api')
const kaptuerDb = require('kaptuer-with-mongo')

let routes = {
    hello:{
        say: {
            path:"/",
            method:"get",
            controller:"hello",
            action:'say',
            middlewares:["needAuth","getAuthInfo"]
        }
    }
}

let services = {
    hello:{
        say: async (req) => {
            return req._userInfo
        }
    }
}

let extension = {
    model: {
        name: String,
        age: Number
    },
    options:{
        accessible:{
            get:["name"],
            update:["name"]
        }
    }
}

kaptuer.use(kap({type:"session",extension}))
kaptuer.use(kaptuerDb.connect([], {rewrite:"mongodb://localhost:27017/test"}, {dbVerbose:true}))

kaptuer.setup({
    routes:routes,
    services:services,
    port:8080
}).start()