const createAuthSystem = require('./libs/createAuthSystem')

module.exports = ({type, extension}) => {

    let { model, options } = extension

    let { middlewares, routes, services, globals } = createAuthSystem(type, {...options}, model)

    // for future feature

    return {

        middlewares,
        routes,
        services,
        globals
    
    }

}