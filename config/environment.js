const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');
str = "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";
const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs('access.log',{
    interval:'1d',
    path:logDirectory
});

const development = {
    name:'development',
    asset_path:'/assets',
    session_cookie_key:'blahsomthing',
    db:'codeial_development',
    smtp:{
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'yashahahire1234@gmail.com',
            pass: 'yash'
        }
    },
    google_clientID:"752490367499-8iasjqnpfnpla21sa80t2e1jlgcvl03u.apps.googleusercontent.com",
    google_clientSecret:str,
    google_callbackURL:"http://localhost:8000/users/auth/google/callback",
    jwt_key_secret:'codeial',
    morgan:{
        mode:'dev',
        Options:{stream:accessLogStream}
    }
}

const production = {
    name:"production",
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key:process.env.CODEIAL_SESSION_COOKIE_KEY,
    db:process.env.CODEIAL_DB,
    smtp:{
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_clientID:process.env.CODEIAL_GOOGLE_CLIENTID,
    google_clientSecret:process.env.CODEIAL_GOOGLE_CLIENTSECRET,
    google_callbackURL:process.env.CODEIAL_GOOGLE_CALLBACKURL,
    jwt_key_secret:process.env.CODEIAL_JWT_KEY_SECRET,
    morgan:{
        mode:'combined',
        Options:{stream:accessLogStream}
    }
}

module.exports = 'development';
// module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);