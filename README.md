# What is this?

This package work with kaptuer for build authentication system faster.

# Installation

`npm i --save kaptuer-with-auth`

then import

```
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
            get:["name","email","age"],
            update:["name"],
            store:["email","name","age"]
        },
    }
}

kaptuer.use(kap({type:"session",extension}))
kaptuer.use(kaptuerDb.connect([], {rewrite:"mongodb://localhost:27017/test"}, {dbVerbose:true}))

kaptuer.setup({
    routes:routes,
    services:services,
    port:<your port>
}).start() 

```

# Options

### type
 - session
 - jwt

### extension
 - model (model extension field as mongo syntax)
 - options
   - accessible
     - get (attribute that allow to show)
     - update (attribute that allow to update)
     - store (attribute that allow to store in token or session)