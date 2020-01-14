let mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');
const saltRounds = 10;
const validator = require('validator');

module.exports = () => {

    let model = {
        email : {
            type:String,
            required : true,
            unique: true,
            lowercase: true,
            validate: {
                validator: validator.isEmail,
                message: `email is invalid`
            },
        },
        password : { type:String, required : true},
    }

    model = new Schema(model, {timestamps:true})
    model.pre('save',  (next) => {
        this.password = bcrypt.hashSync(this.password, saltRounds);
        next()
    });

    model.methods.comparePassword = function(candidatePassword) {
        return bcrypt.compareSync(candidatePassword, this.password);
    };

    return mongoose.model('authentication', model)

}