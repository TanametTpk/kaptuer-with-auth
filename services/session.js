
module.exports = (models, options) => {

    let model = models.userModel
    let {accessible:{store}} = options

    let register = (req) => {

        return req._payload

    }

    let verify = async (req) => {

        return {success: req._verify}

    }

    let verify_socket = async (req) => {

        let key = req.body["password"]
        let target = await model.findOne({email: req.body["email"]})

        if (!target) return {user: null, message:"email not found"}

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

            req._userInfo = userInfo
            return {user: userInfo}

        }

        return {user: null, message: "password is wrong"}

    }

    let logout = (req) => {
        return { success: true }
    }

    let reset_key = async(req) => {
        return {success: true}
    }

    let request_reset = (req) => {
        console.log(req._reset_key);
        
        // send notify to user
        return {success: true}
    }

    return {
        register,
        verify,
        logout,
        reset_key,
        request_reset,
        verify_socket
    }

}