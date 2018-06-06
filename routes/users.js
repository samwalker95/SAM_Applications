
/* MODULE / MIDDLEWARE INSTALLED FOR USERS */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

/* REGISTER USER PAGE */
router.get('/regUser', function (req, res) {
    res.render('regUser');
});

/* LOGIN USER PAGE */
router.get('/login', function (req, res) {
    res.render('login');
});

/* TAKE POST ACTION VALUES FROM regUser AND ENTER THEM INTO VARIABLES */
router.post('/register', function (req, res) {
    var name = req.body.name;
    var role = req.body.role;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    /* FRONT END FIELD VALIDATION FOR USER REGISTRATION */
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('role', 'role').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    /* IF ERRORS REFRESH regUser PAGE */
    if (errors) {
        res.render('regUser', {
            errors: errors
        });
    }
        /* ELSE ADD NEW USER VARIABLES INTO AN ARRAY */
        else {
            var newUser = new User({
                name: name,
                role: role,
                username: username,
                password: password
            });
            /* CREATE USER */
            User.createUser(newUser, function (err, user) {
                if (err) throw err;
                console.log(user);
            });

            req.flash('success_msg', 'User registered and can now login');

            res.redirect('/');
    }

});

/* PASSPORT CONFIGURATION TAKEN FROM http://www.passportjs.org/ */
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));

/* FUNCTION USED FOR CREATING SALT FOR PASSWORD */
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

/* FUNCTION USED FOR SOLVING SALT FOR PASSWORD */
passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

/* ON SUCCESSFUL LOGIN, DIRECT USER TO THE DASHBOARD */
/* ON FAILED LOGIN, DIRECT USER BACK TO LOGIN PAGE */
router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
    function(req, res) {

    });

/* ON LOGOUT, DIRECT USER TO THE LOGIN PAGE */
router.get('/logout', function (req, res) {
    req.logout();

    res.redirect('/users/login');
});

module.exports = router;

