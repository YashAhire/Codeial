const express = require('express');
const app = express();
const port = 8000;
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");

const db = require('./config/mongoose');

// used for session cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strat');

app.use(express.urlencoded());
app.use(cookieParser());


app.use(express.static('./assets'));

app.use(expressLayouts);

// extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



// setup view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'Yash',
    // Todo change the secret before deployment in production mode
    secret: 'blahsomthing',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});
