
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

    SECRETKEY = options.SECRETKEY || SECRETKEY

    let getAuthInfo = (req, res, next) => {
        
        req._userInfo = req.session.user
        next()

    }

    let verify_mid = async (req, res, next) => {

        try {
            
            let key = req.body["password"]
            let target = await model.findOne({email: req.body["email"]})

            let result = target.comparePassword(key)
            if (result)
                req.session.user = {
                    _id: target._id,
                    email: target.email
                }

            req._verify = result
            
        } catch (error) {
            next(error)
        }

        next()

    }

    let logout_mid = (req, res, next) => {
        req.session.destroy()
        next()
    }

    let needAuth = (req, res ,next) => {

        if (!req.session.user){
            res.notFound({meg: "please login"})
        }

        next()

    }

    const _authentication = require('../auth/session')(options)

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