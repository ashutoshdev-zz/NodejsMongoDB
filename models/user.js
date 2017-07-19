/**
 * @author ashutosh
 * @type type
 * user model
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var UserSchema = mongoose.Schema({
    user: {
        password: String,
        name: String,
        email: String,
        status:String,
        adminstatus:String
    },
});
// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
// checking if password is valid
UserSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password,this.user.password);
};
//userSchema.methods.updateUser = function(request, response){
//
//	this.user.name = request.body.name;
//	this.user.address = request.body.address;
//	 this.user.save();
//	response.redirect('/user');
//};
module.exports = mongoose.model('User', UserSchema);
//module.exports = mongoose.model('User', {
//    username: String,
//    password: String,
//    name: String,
//    address: String,
//    email: String
//});