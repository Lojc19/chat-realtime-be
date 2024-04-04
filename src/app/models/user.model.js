const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
// const crypto = require("crypto");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        minlength: 6,
        required:true,
    },
    gender:{
        type:String,
        required:true,
        enum: ["male", "female"],
    },
    profilePic:[{
        type: String,
        default: ""
    }],
}, {
    collection: "users",
    timestamps: true,
}
);

userSchema.pre("save",async function (next){
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
userSchema.methods.isPasswordMatched = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};


//Export the model
module.exports = mongoose.model('User', userSchema);