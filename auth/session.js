const session = require('express-session')
const _ = require('lodash')

module.exports = (options) => {

    options = _.defaultsDeep(
        options,
        {
            secret: 'default_secret_key' + Math.random(),
            resave: false,
            saveUninitialized: true,
        }
    )
        
    return session(options)

}