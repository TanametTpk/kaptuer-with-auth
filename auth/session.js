
module.exports = (model) => {

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

        req._userInfo = req.session.user
        next()

    }

    let register_mid = (req, res, next) => {

        let { _id, email } = model.create(req.body)

        req._payload = { _id, email }
        next()

    }

    let verify_mid = async (req, res, next) => {

        let key = req.body["password"]
        let target = await model.findOne({email: req.body["email"]})

        let result = target.comparePassword(key)
        if (result)
            req.session.user = {
                _id: target._id,
                email: target.email
            }
        
        req._verify = result

        next()

    }

    let logout_mid = (req, res, next) => {
        res.clearCookie(req.cookies.user_sid);
        next()
    }

    let reset_key_mid = async(req, res, next) => {
        let { _id, email } = await updateOne({email: req._identity}, {password: req.body.password});
        req._payload = { _id, email }
        next()
    }

    let request_reset_mid = () => {
        // send notify to user
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
        request_reset_mid
    }

}