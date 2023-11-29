const express = require('express');
const app = express();
const port = 8000;

// used for session cookies
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");

const db = require('./config/mongoose');

// used for session cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strat');

const MongoStore = require('connect-mongo');

// SASS library
const sassMiddleware = require('node-sass-middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest:'./assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded());
app.use(cookieParser());

// for using static files
app.use(express.static('./assets'));

// for using partials and layouts
app.use(expressLayouts);

// extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// setup view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'Yash',
    // Todo change the secret before deployment in production mode
    secret: 'blahsomthing',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongoUrl: 'mongodb://127.0.0.1:27017/codeial_development',
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setp ok!!');
        }
    )
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
