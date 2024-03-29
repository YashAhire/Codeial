const Post = require('../models/post');
const Comment = require('../models/comments');
 
module.exports.create = async function(req,res){
    // Post.create({
    //     content: req.body.content,
    //     user: req.user._id,
    // })
    // .then((post) => {  
    //     if(req.xhr){
    //         // if we want to populate just the name of the user (we'll not want to send the password in the API)
    //         // this is how we do it!
    //         post = post.populate('user','name').execPopulate();
    //         return res.status(200).json({
    //             data:{
    //                 post:post
    //             },
    //             message:"Post Created!!"
    //         });
        
    //     }
    //     req.flash('success', 'Post published!');
    //     return res.redirect('back');
    // })
    // .catch(err => {
    //     req.flash("error", err);
    //     return res.redirect('back');
    // })

    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        
        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();
            
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');

    }catch(err){
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
}


module.exports.destroy = async function(req,res){

    let post = await Post.findById(req.params.id);
    try{
            // .id means converting the object id into string
            if(post.user == req.user.id){
                post.deleteOne();
                
                await Comment.deleteMany({post: req.params.id});
                if(req.xhr){
                    return res.status(200).json({
                        data:{
                            post_id:req.params.id
                        },
                        message:"Post deleted"
                    });
                }
                req.flash('success', 'Post & associated coments deleted!');
                return res.redirect('back');
                
            }
            else{
                req.flash('error', " you can't delete this post!!!"); 
                return res.redirect('back');
            }
        }
        catch(err){
            req.flash("error", err);
            return res.redirect('back');
        }
}