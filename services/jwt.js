
module.exports = (models) => {

    let register = (req) => {

        return req._payload

    }

    let verify = async (req) => {

        return {success: req._verify, info:req._payload}

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
        request_reset
    }

}