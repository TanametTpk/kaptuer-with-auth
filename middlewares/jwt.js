
const jwt = require('jsonwebtoken');
const SECRETKEY = "gf!!SA^F6f7a809"

module.exports = (model, options) => {

    let _getIdentity = (req, res, next) => {

        let idName = "email"
        let identity = req.body[idName]

        req._identity = identity
        next()

    }

    let _getKey = (req, res, next) => {

        let keyName = "password"
        let key = req.body[keyName]

        req._key = key
        next()

    }

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

    let register_mid = async (req, res, next) => {

        try {
            let target = new model(req.body)
            let { _id, email } = await target.save()
            req._payload = { _id, email }
            
        } catch (error) {
            next(error)
        }
        next()

    }

    let verify_mid = async (req, res, next) => {

        try {
            
            let key = req.body["password"]
            let target = await model.findOne({email: req.body["email"]})

            let result = target.comparePassword(key)
            if (result){

                let userInfo = {
                    _id: target._id,
                    email: target.email
                }

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

    let reset_key_mid = async(req, res, next) => {

        try {
            let doc = await model.findOne({email: req._resetInfo.email});
            doc.password = req.body.password
            await doc.save()
        } catch (error) {
            next(error)
        }

        next()
    }

    let request_reset_mid = (req, res, next) => {
        // send notify to user

        let key = jwt.sign({email: "hello@mail.com"}, SECRETKEY, {expiresIn:"1h"})
        // console.log(key);
        
        next()
    }

    let get_reset_publicKey = (req, res, next) => {

        jwt.verify(req.query.token, SECRETKEY, function(err, decoded) {
            
            if (err) return next(err)
            
            req._resetInfo = decoded
            next()

        })

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