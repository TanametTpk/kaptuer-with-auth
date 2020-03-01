const createModel = require('./createModel')
const createModelOauth = require('./createModelOauth')

module.exports = (type, options, extension_model) => {

    if (!options) options = {}
    if (!extension_model) extension_model = {}
    
    model_name = options.model_name
    if (!model_name) model_name = "users"

    let userModel = createModel(extension_model, model_name)
    let oauthModel = null

    let controller_name = 'auth'

    if (type === 'oauth'){
        controller_name = 'oauth'
        oauthModel = createModelOauth(model_name)
    }

    let model = {
        userModel,
        oauthModel
    }

    let middlewares = require(__dirname + `/../middlewares/${type}`)(model, options)
    let services = require(__dirname + `/../services/${type}`)(model, options)
    let routes = require(__dirname + `/../routes/${controller_name}`)

    let user_services = require(__dirname + "/../services/user")(model, options)
    let user_routes = require(__dirname + "/../routes/user")
    let user_middlewares = require(__dirname + `/../middlewares/user`)(model, options)

    let socket_middlewares = {}
    if (options.socket){
        if (type === 'oauth') type = "session"
        socket_middlewares = require(__dirname + `/../socket/${type}`)(model, options)
    }

    middlewares = {
        ...middlewares,
        ...user_middlewares
    }

    return {

        _model:model,
        middlewares,
        routes:{ [controller_name]:routes, user:user_routes },
        services :{ [controller_name]:services, user: user_services },
        globals: {
            middlewares:["_authentication"]
        },
        configs: {
            socket:{
                middlewares:socket_middlewares
            }
        }
    
    }

}