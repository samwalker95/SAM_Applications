
/* MODULE / MIDDLEWARE INSTALLED FOR USER MODULE */
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

/* SCHEME FOR USERS COLLECTION */
/* SCHEME VALIDATION RULES FOR USERS COLLECTION */
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index:true
    },
    password: {
        type: String
    },
    role: {
        type: String
    },
    name: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

/* PASSPORT CONFIGURATION TAKEN FROM http://www.passportjs.org/ */
/* BCRYPTJS SALTING PASSWORD IN USERS COLLECTION */
module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

/* GET USERNAME FOR WRITING TO USERS COLLECTION*/
module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

/* GET OBJECTID FOR WRITING TO USERS COLLECTION*/
module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

/* GET PASSWORD FOR SALTING AND WRITING TO USERS COLLECTION*/
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}