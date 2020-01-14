const createAuthSystem = require('./libs/createAuthSystem')

module.exports = ({type}) => {

    let { middlewares, routes, services } = createAuthSystem(type)

    return {

        middlewares,
        routes,
        services
    
    }

}