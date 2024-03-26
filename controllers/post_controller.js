const Post = require('../models/post');
const Comment = require('../models/comments');
 
module.exports.create = function(req,res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    })
    .then(post => {  
        req.flash('success', 'Post published!');
        return res.redirect('back');
    })
    .catch(err => {
        req.flash("error", err);
        return res.redirect('back');
    })
}

module.exports.destroy = function(req,res){
    Post.findById(req.params.id)
        .then(post => {
            // .id means converting the object id into string
            if(post.user == req.user.id){
                post.deleteOne()
                .then(() => {
                    Comment.deleteMany({post: req.params.id})
                    req.flash('success', 'Post & associated coments deleted!');
                })
                .then(() =>{
                    return res.redirect('back');
                })
            }
            else{
                req.flash('error', " you can't delete this post ");
                return res.redirect('back');
            }
        })
        .catch(err =>{
            req.flash("error", err);
            return res.redirect('back');
        })
}