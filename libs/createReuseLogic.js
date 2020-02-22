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

    let request_reset_mid = (req, res, next) => {
        // send notify to user

        let key = jwt.sign({email: req.body.email}, SECRETKEY, {expiresIn:"1h"})
        req._reset_key = key
        
        next()
    }

    let get_reset_publicKey = (req, res, next) => {

        jwt.verify(req.query.token, SECRETKEY, function(err, decoded) {
            
            if (err) return next(err)
            
            req._resetInfo = decoded
            next()

        })

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

    return {
        _getIdentity,
        _getKey,
        get_reset_publicKey,
        request_reset_mid,
        register_mid,
        reset_key_mid
    }

}