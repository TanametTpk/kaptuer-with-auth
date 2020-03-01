
let SECRETKEY = "gf!!SA^F6f7a809"

module.exports = (models, options) => {

    SECRETKEY = options.SECRETKEY || SECRETKEY

    let needAuth = (req ,next) => {

        if (!req._userInfo){
            throw new Error("plz login")
        }

        next()

    }

    return {
        needAuth,
    }

}