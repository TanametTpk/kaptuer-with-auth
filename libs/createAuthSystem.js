const createModel = require('./createModel')

module.exports = (type, options, extension_model) => {

    if (!options) options = {}
    if (!extension_model) extension_model = {}

    let model = createModel(extension_model)

    let middlewares = require(__dirname + `/../middlewares/${type}`)(model, options)
    let services = require(__dirname + `/../services/${type}`)(model)
    let routes = require(__dirname + "/../routes/auth")

    let user_services = require(__dirname + "/../services/user")(model)
    let user_routes = require(__dirname + "/../routes/user")
    let user_middlewares = require(__dirname + `/../middlewares/user`)(model, options)
    middlewares = {
        ...middlewares,
        ...user_middlewares
    }

    return {

        model,
        middlewares,
        routes:{ auth:routes, user:user_routes },
        services :{ auth:services, user: user_services },
        globals: {
            middlewares:["_authentication"]
        }
    
    }

}