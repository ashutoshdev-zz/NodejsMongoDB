/**
 * @author ashutosh
 * @type @call;require@pro;Strategy
 * passport js
 */
var LocalStrategy = require('passport-local').Strategy;
// load up the user model
var User = require('../models/user');
///console.log(User);
// expose this function to our app using module.exports
module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('user', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        //console.log(req.verifyPassword(password));
        process.nextTick(function() {
            User.findOne({'user.email': email,'user.status': '1','user.adminstatus':'1'}, function(err, user) {
                 //console.log('here');
                       // var logUser = new User(); 
                       // console.log(logUser);
                // console.log(err);
                if (err) {
                    return done(err);
                }
                if (!user) {

                    return done(null, false, req.flash('error', 'User does not exist.'));
                }
                if (!user.verifyPassword(password)) {
                    //console.log("asd");
                    return done(null, false, req.flash('error', 'Enter correct password'));
                }
                else {
                    return done(null, user);
                }
            });
        });
    }));
    passport.use('signup', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            if (!req.user) {
                User.findOne({'user.email': email}, function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('signuperror', 'User already exists'));
                    } else {
                        var newUser = new User();
                        newUser.user.email = email;
                        newUser.user.password = newUser.generateHash(password);
                        newUser.user.name = req.body.name,
                        newUser.user.status = "0",
                        newUser.user.adminstatus = "0"
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            } else {
                var user = req.user;
                user.user.email = email;
                user.user.password = user.generateHash(password);
                user.user.name = req.body.name,
                user.user.status = "0",
                user.user.adminstatus = "0"
                user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }
        });
    }));
};