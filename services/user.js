
module.exports = (model) => {

    let dummy = (req) => {

        return req._payload

    }

    return {
        dummy,
    }

}