const Post = require('../../../models/post');

module.exports.index = async function(req, res){

    let post = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path : 'comments',
        populate : {
            path : 'user'
        }
    });

    return res.json(200,{
        massage:"List of posts",
        Version: 'V1',
        posts: post
    })
}

module.exports.destroy = async function(req,res){

    let post = await Post.findById(req.params.id);
    try{
            // .id means converting the object id into string
            if(post.user == req.user.id){
                post.deleteOne();
                
                await Comment.deleteMany({post: req.params.id});
                return res.json(200,{message: 'Post & associated coments deleted!'});
                
            }
            else{
                return res.json(200,{message: 'you cannot delete this post'});
            }
        }
        catch(err){
            console.log(err);
            return res.json(200,{message: 'Internal server error!!'});
        }
}