const User = require('../models/user');
const fs = require('fs');
const path = require('path');


module.exports.profile = function(req, res){
    // res.end("<h1>Users Profile!!!</h1>");
    // return res.render('users.ejs',{
    //     title : "Users page"
    // });

    // this is using for manual authentication 
    // if(req.cookies.user_id){
    //     User.findById(req.cookies.user_id)
    //         .then(user =>{
    //             if(user){
    //                 return res.render('users_profile',{
    //                     title:"User Profile",
    //                     user:user
    //                 });   
    //             } 
    //         })
    //         .catch(err => {
    //             console.log("User not able to sign In");
    //         })
    // }else{
    //     return res.redirect('/users/sign-In');
    // }

    User.findById(req.params.id)
        .then(user => {
            return res.render('users_profile',{
                title:"User Profile",
                profile_user:user
            });
        });
}

module.exports.update = async function(req,res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body)
    //         .then(user => {
    //             req.flash('success', 'Updated!');
    //             return res.redirect('back');
    //         });
    // }else{
    //     // req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    // }
    if(req.user.id == req.params.id){
        try {
            
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('******* Multer Error: ', err);
                }
                user.name = req.body.name;
                user.email = req.body.email;
                if(req.file){
                    
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    // this is saving the path of the uploaded file into the avatr field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save()
                return res.redirect('back');
            })

        } catch (error) {
            req.flash('error', err);
            return res.redirect('back');
        }
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

// rener the Sign Up page
module.exports.signUp = function(req,res){

    return res.render('user_sign_Up',{
        title:"Codeial | Sign Up"
    })
}

// render the Sign In page
module.exports.signIn = function(req,res){
    return res.render('user_sign_In',{
        title:"Codeial | Sign In"
    })
}

//get the sign up data
module.exports.create = function(req,res){

    if(req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
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
}

// sign in and create session for the user
// module.exports.create_session = function(req,res){

//     // Steps to athenticate
//     // find the user
//     User.findOne({email:req.body.email})
//         .then(user =>{
//             // handle user found
//             if(user){
//                 // handle password which doesn't match
//                 if(user.password != req.body.password){
//                     return res.redirect('back');
//                 }
//                 // handle session creation
//                 res.cookie('user_id',user.id);
//                 return res.redirect('/users/profile');
//             }else{
//                 // handle user not found
//                 return res.redirect('back');
//             }
//         })
//         .catch(err =>{
//             console.log("error in finding email in signing In");
//             return;
//         })
// };

module.exports.createSession = function(req,res){
    req.flash('success','Logged In Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res, next){
    // logout funtion it's handle by passport library
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success','You have logged out!');
      res.redirect('/');
    });
}
