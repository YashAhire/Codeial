module.exports.index = function(req, res){
    return res.json(200,{
        massage:"List of posts",
        Version:"V2",
        posts:[]
    })
}