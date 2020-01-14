const createModel = require('./createModel')

module.exports = (type, options) => {

    let model = createModel()

    let middlewares = require(__dirname + `/../middlewares/${type}`)(model, options)
    let services = require(__dirname + `/../services/${type}`)(model)
    let routes = require(__dirname + "/../routes/auth")

    return {

        model,
        middlewares,
        routes:{ auth:routes },
        services :{ auth:services },
        globals: {
            middlewares:["_authentication"]
        }
    
    }

}