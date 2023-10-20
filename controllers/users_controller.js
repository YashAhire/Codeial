const User = require('../models/user');

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

    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    // User.findOne({email: req.body.email}, function(err, user){
    //     if(err){console.log("error in finding email in signing Up"); return;}
    //     if(!user){
    //         User.create(req.body, function(err, user){
    //             if(err){console.log("error in creating user while signing Up"); return;}
    //             return res.redirect('/users/sign-In');
    //         })
    //     }else{
    //         return res.redirect('back');
    //     }
    // })

    User.findOne({email:req.body.email})
        .then(user =>{
            if(!user){
                return User.create(req.body)
                    .then(newUser =>{
                        return res.redirect('/users/sign-In');
                    })
                    .catch(err =>{
                        console.log("error in creating user while signing Up");
                        return;
                    })
            }
            else{
                return res.redirect('back');
            }
        })
        .catch(err =>{
            console.log("error in finding email in signing Up");
            return;
        })
};

// sign in and create session for the user
module.exports.create_session = function(req,res){
    //Todo later
};