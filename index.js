const createAuthSystem = require('./libs/createAuthSystem')

module.exports = ({type, extension}) => {

    let { model, options } = extension

    let { _model, middlewares, routes, services, globals } = createAuthSystem(type, {...options}, model)

    // for future feature

    return {

        _model,
        middlewares,
        routes,
        services,
        globals
    
    }

}