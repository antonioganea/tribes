import { findUser, insertUser } from "../model/database";
import express from 'express';

export function setAppPassportMiddleware(app : any){
    
    // PASSPORT JS PART
    var passport = require('passport');
    var Strategy = require('passport-local').Strategy;
    var session = require('express-session');
    var cookieSession = require('cookie-session');
    var cookieParser = require('cookie-parser');

    passport.serializeUser(function(user :any, done :any) {
    //console.log("serialization")
    //console.log(JSON.stringify(user))
    done(null, JSON.stringify(user));
    });

    passport.deserializeUser(function(user :any, done :any) {
    //console.log("Deserialization")
    //console.log(user)
    done(null, JSON.parse(user)); // TODO : handle deserialization if parsing fails ( weird cookie input )
    });

    app.use(cookieParser('secret'));
    app.use(cookieSession({signed:false}));
    app.use(session({ secret: 'anything' }));

    app.use(require('body-parser').urlencoded({ extended: true }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.set('view engine', 'ejs');
    

    passport.use(new Strategy(
    function(username : any, password : any, cb : any) {
        findUser(username, function(err : any, user : any) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
        });
    }));

    app.post('/login',
    passport.authenticate('local', { successRedirect: '/',
                                    failureRedirect: '/login'})
    );

    app.get('/login', (req, res) => {
    let data = {
        formButtonName: "Login",
        username: null
    }
    res.render("pages/login", data)
    })

    app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
    });

    app.get('/register', (req, res) => {
    let data = {
        formButtonName: "Register",
        username: null
    }
    res.render("pages/register", data);
    })

    app.post('/register', (req, res) => {
    insertUser(req.body.username, req.body.email, req.body.password);
    res.redirect('/');
    })
    
}