module.exports.profile = function(req,res){
    // res.end("<h1>Users Profile!!!</h1>");

    return res.render('users.ejs',{
        title : "Users page"
    });
}