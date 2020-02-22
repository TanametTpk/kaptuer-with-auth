
module.exports = (models) => {

    let dummy = (req) => {

        return req._payload

    }

    return {
        dummy,
    }

}