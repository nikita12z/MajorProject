const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

//username and password automatically defined by passportlocal mongoose
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose); //pluged in as it automatically implements username, hashing, salting and hashpass

module.exports = mongoose.model("User", userSchema);


