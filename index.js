const createAuthSystem = require('./libs/createAuthSystem')

module.exports = ({type}) => {

    let { middlewares, routes, services } = createAuthSystem(type)

    // for future feature

    return {

        middlewares,
        routes,
        services
    
    }

}