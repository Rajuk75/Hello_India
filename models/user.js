const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose=require("passport-local-mongoose");

const userSchema =new Schema({

    email:{
        type:String,
        require:true
    },
});


// Add passport-local-mongoose plugin to handle salting and hashing of passwords
userSchema.plugin(passportLocalMongoose); // This applies the plugin to the schema

module.exports = mongoose.model('User', userSchema);