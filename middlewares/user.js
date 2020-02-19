
module.exports = (model, options) => {

    let { accessible } = options
    if (! accessible) accessible = {get:[],update:[]}

    let _user_get_mid = async (req, res, next) => {
        try {
            let target = await model.findOne({_id: req.params.userId}, accessible.get.join(" , "))
            req._payload = target
        }
        catch (error) {
            return next(error)
        }
        next()
    }

    let _user_update_mid = async (req, res, next) => {
        
        try {
            let update_att = {}
        
            accessible.update.map((i) => {
                update_att = {
                    ...update_att,
                    [i]:req.body[i]
                }
            })
            
            let target = await model.updateOne({_id: req.params.userId}, update_att)
            req._payload = target
        }
        catch (error) {
            return next(error)
        }
        next()
    }

    let _user_del_mid = async (req, res, next) => {
        try{
            let target = await model.deleteOne({_id: req.params.userId})
            req._payload = target
        }
        catch (error) {
            return next(error)
        }
        next()
    }

    let _user_me_mid = async (req, res, next) => {
        try{
            let target = await model.findOne(req._userInfo, accessible.get.join(" , "))
            req._payload = target
        }
        catch (error) {
            return next(error)
        }
        next()
    }

    return {
        _user_get_mid,
        _user_update_mid,
        _user_del_mid,
        _user_me_mid
    }

}