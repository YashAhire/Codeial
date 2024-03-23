const Comment = require('../models/comments');
const Post = require('../models/post');

// module.exports.create = function(req,res){
//     Post.findById(req.body.post)
//         .then(post => {
//             Comment.create({
//                 content : req.body.content,
//                 post : req.body.post,
//                 user : req.user._id
//             })
//         })
//         .then(comment => {
//             post.comments.push(comment);
//             post.save();
//         })
//         .then(() =>{
//             return res.rediect('/');
//         })
//         .catch(err => {
//             console.error("Error in creating post-comment's", err);
//             return;
//         })
// }

module.exports.create = function(req, res) {
    Post.findById(req.body.post)
        .then(post => {
            // Create a comment
            return Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })
            .then(comment => {
                // Push the comment to the post and save the post
                post.comments.push(comment);
                return post.save();
            })
            .then(() => {
                // Redirect after successful creation
                return res.redirect('/');
            })
            .catch(err => {
                console.error("Error in creating post-comment's", err);
                return res.status(500).send("Internal Server Error");
            });
        })
        .catch(err => {
            console.error("Error in finding post", err);
            return res.status(404).send("Post not found");
        });
};

module.exports.destroy = function(req,res){
    Comment.findById(req.params.id)
        .then(comment => {
            if(comment.user == req.user.id){
                let postId = comment.post;
                comment.deleteOne();
                Post.findByIdAndUpdate(postId, { $pull : {comments: req.params.id}})
                    .then(() => {
                        return res.redirect('back');
                    })
            }
            else{
                return res.redirect('back');
            }
        });
};