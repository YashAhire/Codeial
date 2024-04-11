
const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const env = require('../../../config/environment');
module.exports.createSession = async function(req, res){
    try {
        
        let user = await User.findOne({email: req.body.email});
        if(!user || user.password != req.body.password){
            return res.json(422,{
                message:"Invalid UserName or password"
            });
        }

        return res.json(200,{
            message:"Sign In successfully, here is u r token keep it safe!",
            data:{
                token: jwt.sign(user.toJSON(), env.jwt_key_secret, {expiresIn:'100000'})
            }
        })

    } catch (error) {
        console.log('error',error);
        return res.json(500,{
            message:'Internal server error'
        });
    }
}