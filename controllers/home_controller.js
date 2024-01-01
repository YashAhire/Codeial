const Post = require('../models/post');

module.exports.home = function(req, res){
    // return res.end('<h1>Express is up for Codeial!!</h1>');
    //console.log(req.cookies);
    // res.cookie('user_id', 5);

    Post.find({})
    .populate('user')
    .populate({
        path : 'comments',
        populate : {
            path : 'user'
        }
    })
    .exec()
        .then(posts =>{
            return res.render('home.ejs', {
                title : " | Home  ",
                posts : posts
            });
        })
        .catch(err =>{
            console.log("Error while finding posts!!");
            return;
        })

}