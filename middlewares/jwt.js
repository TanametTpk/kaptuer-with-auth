
const jwt = require('jsonwebtoken');
let SECRETKEY = "gf!!SA^F6f7a809"

module.exports = (model, options) => {

    let {
        _getIdentity,
        _getKey,
        get_reset_publicKey,
        request_reset_mid,
        register_mid,
        reset_key_mid
    } = require('../libs/createReuseLogic')(model, options)

    let {accessible:{store}} = options

    SECRETKEY = options.SECRETKEY || SECRETKEY

    let getAuthInfo = (req, res, next) => {
        
        if (req._userInfo) return next()

        let token = req.body.token || req.headers[ "authorization" ];
		if(req.headers[ "authorization" ]) token = token.split(' ')[1];

        if ( token ) {
            return jwt.verify( token, SECRETKEY, function( err, decoded ) {
                if ( err ) req._userInfo = {}
                else req._userInfo = decoded;
                return next();
            } );
        }

        req._userInfo = {}
        next()

    }

    let verify_mid = async (req, res, next) => {

        try {
            
            let key = req.body["password"]
            let target = await model.findOne({email: req.body["email"]})

            let result = target.comparePassword(key)
            if (result){

                let userInfo = {}
                let keys = Object.keys(target._doc)

                // force adding field
                store = [ "_id", ...store]

                keys.map((k) => {
                    if (store.includes(k)){
                        userInfo = {
                            ...userInfo,
                            [k]:target._doc[k]
                        }
                    }
                })

                req._payload = {
                    user: userInfo,
                    token:jwt.sign(userInfo, SECRETKEY)
                }

            }

            req._verify = result
            
        } catch (error) {
            next(error)
        }

        next()

    }

    let logout_mid = (req, res, next) => {
        next()
    }

    let needAuth = (req, res ,next) => {

        let token = req.body.token || req.headers[ "authorization" ];
		if(req.headers[ "authorization" ]) token = token.split(' ')[1];

        if ( token ) {
            return jwt.verify( token, SECRETKEY, function( err, decoded ) {
                if ( err ) {
                    return res.unauthorized({
                        message: "Failed to authenticate token.",
                    });
                }
                req._userInfo = decoded;
                return next();
            } );
        }
        return res.unauthorized();

    }

    const _authentication = (req, res ,next) => {

        next()

    }

    return {
        _getIdentity,
        _getKey,
        getAuthInfo,
        register_mid,
        verify_mid,
        logout_mid,
        reset_key_mid,
        request_reset_mid,
        _authentication,
        needAuth,
        get_reset_publicKey
    }

}