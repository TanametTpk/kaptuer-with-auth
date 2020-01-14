
module.exports = (model) => {

    let register = (req) => {

        return req.payload

    }

    let verify = async (req) => {

        return {success: req._verify}

    }

    let logout = (req) => {
        return { success: true }
    }

    let reset_key = async(req) => {
        return req.payload
    }

    let request_reset = () => {
        // send notify to user
        return {success: true}
    }

    return {
        register,
        verify,
        logout,
        reset_key,
        request_reset
    }

}