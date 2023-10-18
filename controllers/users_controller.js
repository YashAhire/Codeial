module.exports.profile = function(req,res){
    // res.end("<h1>Users Profile!!!</h1>");

    return res.render('users.ejs',{
        title : "Users page"
    });
}


// rener the Sign Up page
module.exports.signUp = function(req,res){
    return res.render('user_sign_Up',{
        title:"Codeial | Sign Up"
    })
};

// render the Sign In page
module.exports.signIn = function(res,res){
    return res.render('user_sign_In',{
        title:"Codeial | Sign In"
    })
};

//get the sign up data
module.exports.create = function(req,res){
    //Todo later
};

// sign in and create session for the user
module.exports.create_session = function(req,res){
    //Todo later
};