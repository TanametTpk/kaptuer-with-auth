
const jwt = require('jsonwebtoken');
let SECRETKEY = "gf!!SA^F6f7a809"

module.exports = (models, options) => {

    let model = models.userModel
    let oauthModel = models.oauthModel
    

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

    let grant_password_mid = async (req, res, next) => {

        try{

            // check password and id
            let key = req.body["password"]
            let target = await model.findOne({email: req.body["email"]})

            if (!target) return res.unauthorized();
            let result = target.comparePassword(key)

            // send back access token with refresh
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

                let exp_acc = Math.floor(Date.now() / 1000) + (60 * 60) // 1h
                let exp_ref = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 14) // 2 week

                req._payload = {
                    access_token: jwt.sign(userInfo, SECRETKEY, {expiresIn: exp_acc}),
                    token_type:"bearer",
                    expires_in: exp_acc,
                    refresh_token: jwt.sign({}, SECRETKEY, {expiresIn: exp_ref}),
                    info:userInfo
                }

                let tokenObj = new oauthModel({
                    user: userInfo._id,
                    access_token: req._payload.access_token,
                    refresh_token: req._payload.refresh_token,
                })
                tokenObj.save()

            }

            req._verify = result

        }catch (error){

            next(error)

        }

        next()

    }

    let grant_refresh_token_mid = async (req, res, next) => {

        try{

            // find refresh token and get user information
            let target = await oauthModel.findOne({refresh_token:req.body.refresh_token}).populate("user")
            let userInfo = {}

            if (!target) return res.unauthorized();
            let keys = Object.keys(target._doc)
            store = [ "_id", ...store]

            keys.map((k) => {
                if (store.includes(k)){
                    userInfo = {
                        ...userInfo,
                        [k]:target._doc[k]
                    }
                }
            })

            // create new refresh token and access token
            let exp_acc = Math.floor(Date.now() / 1000) + (60 * 60) // 1h
            let exp_ref = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 14) // 2 week
            req._payload = {
                access_token: jwt.sign(userInfo, SECRETKEY, {expiresIn: exp_acc}),
                token_type:"bearer",
                expires_in: exp_acc,
                session_id:target._id,
                refresh_token: jwt.sign({}, SECRETKEY, {expiresIn: exp_ref}),
                info:userInfo
            }

            // update refresh token in db
            target.access_token = req._payload.access_token
            target.refresh_token = req._payload.refresh_token
            target.save()

        }catch (error){

            next(error)

        }

        next()

    }

    let grant_mid = (req, res, next) => {

        // check grant type
        if (req.params.grant_type === "password"){
            return grant_password_mid(req,res,next)
        }

        else if (req.params.grant_type === "refresh"){
            return grant_refresh_token_mid(req,res,next)
        }

        next()
    }

    let check_token_mid = async (req, res, next) => {

        try {
            
            req._payload = req._userInfo
            
        } catch (error) {
            next(error)
        }

        next()

    }

    let revoke_mid = async (req, res, next) => {

        // find token or user
        // delete from token table
        await oauthModel.deleteMany(req.body)

        // return true

        next()
    }

    let needAuth = async (req, res ,next) => {

        let target = await oauthModel.findOne({access_token:req.query.token}).populate("user")
        let userInfo = {}

        if (!target) return res.unauthorized();
        target = target.user
        let keys = Object.keys(target._doc)
        
        store = [ "_id", ...store]

        keys.map((k) => {
            if (store.includes(k)){
                userInfo = {
                    ...userInfo,
                    [k]:target._doc[k]
                }
            }
        })

        req._userInfo = userInfo;
        return next()

    }

    const _authentication = (req, res ,next) => {

        next()

    }

    return {
        _getIdentity,
        _getKey,
        getAuthInfo,
        grant_mid,
        register_mid,
        check_token_mid,
        revoke_mid,
        reset_key_mid,
        request_reset_mid,
        _authentication,
        needAuth,
        get_reset_publicKey
    }

}