const createModel = require('./createModel')
const createModelOauth = require('./createModelOauth')

module.exports = (type, options, extension_model) => {

    if (!options) options = {}
    if (!extension_model) extension_model = {}

    let userModel = createModel(extension_model)
    let oauthModel = null

    let controller_name = 'auth'

    if (type === 'oauth'){
        controller_name = 'oauth'
        oauthModel = createModelOauth()
    }

    let model = {
        userModel,
        oauthModel
    }

    let middlewares = require(__dirname + `/../middlewares/${type}`)(model, options)
    let services = require(__dirname + `/../services/${type}`)(model)
    let routes = require(__dirname + `/../routes/${controller_name}`)

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
        routes:{ [controller_name]:routes, user:user_routes },
        services :{ [controller_name]:services, user: user_services },
        globals: {
            middlewares:["_authentication"]
        }
    
    }

}