const jwt = require('jsonwebtoken');
let SECRETKEY = "gf!!SA^F6f7a809"

module.exports = (models, options) => {

    SECRETKEY = options.SECRETKEY || SECRETKEY

    let needAuth = (req ,next) => {

        let token = req.handshake.query.token

        // if already login
        if (req._userInfo) return next()

        if ( token ) {
            return jwt.verify( token, SECRETKEY, function( err, decoded ) {
                
                if ( err ) return next(err)

                req._userInfo = decoded;
                return next();

            } );
        }

        throw new Error("plz login")

    }

    return {
        needAuth,
    }

}