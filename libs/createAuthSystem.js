const createModel = require('./createModel')

module.exports = (type) => {

    let model = createModel()

    let middlewares = require(__dirname + `/../auth/${type}`)(model)
    let services = require(__dirname + `/../services/${type}`)(model)
    let routes = require(__dirname + "/../routes/auth")

    return {

        model,
        middlewares,
        routes,
        services
    
    }

}