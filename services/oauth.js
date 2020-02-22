
module.exports = (models) => {

    let register = (req) => {

        return req._payload

    }

    let grant = async (req) => {

        return req._payload

    }

    let check_token = async (req) => {

        return req._payload

    }

    let revoke = (req) => {
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
        grant,
        check_token,
        revoke,
        reset_key,
        request_reset
    }

}