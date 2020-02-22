let mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');
const saltRounds = 10;
const validator = require('validator');

module.exports = (extension_model) => {

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
        ...extension_model
    }

    model = new Schema(model, {timestamps:true})
    model.pre('save', function(next){
        this.password = bcrypt.hashSync(this.password, saltRounds);
        next()
    });

    model.methods.comparePassword = function(candidatePassword) {
        return bcrypt.compareSync(candidatePassword, this.password);
    };

    return mongoose.model('user', model)

}