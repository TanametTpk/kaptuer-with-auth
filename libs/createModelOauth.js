let mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = (model_name) => {

    let model = {
        user: {type:Schema.Types.ObjectId, ref:model_name, require:true},
        access_token: {type:String, require:true},
        refresh_token: {type:String, require:true}
    }

    model = new Schema(model, {timestamps:true})
    return mongoose.model('oauth_token', model)

}