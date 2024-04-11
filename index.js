const express = require('express');
const app = express();
const port = 8000;
const env = require('./config/environment');
const logger = require('morgan');
require('./config/view-helpers')(app);
// used for session cookies
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");

const db = require('./config/mongoose');

// used for session cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strat');
const passportJwt = require('./config/passport-jwt');

const passportGoogle = require('./config/passport-google-oauth2-stat');

const MongoStore = require('connect-mongo');

// SASS library
const sassMiddleware = require('node-sass-middleware');
// display flash msg
const flash = require('connect-flash');
// middleware for flash msg
const customMW = require('./config/middleware');
// setup a chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
const path = require('path');

if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest:path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
    }));
}

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

// for using static files
app.use(express.static(env.asset_path));
// make the upload path available to browser
app.use('/uploads',express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));
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
    secret: env.session_cookie_key,
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
// use flash lib
app.use(flash());
app.use(customMW.setFlash);
//use express router
app.use('/',require('./routes'));


app.listen(port,function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});
