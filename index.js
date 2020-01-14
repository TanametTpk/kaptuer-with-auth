const createAuthSystem = require('./libs/createAuthSystem')

module.exports = ({type}) => {

    let { middlewares, routes, services, globals } = createAuthSystem(type)

    // for future feature

    return {

        middlewares,
        routes,
        services,
        globals
    
    }

}