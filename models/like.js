const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId
    },
    // this defines the object id of the liked object
    likable:{
        type:mongoose.Schema.ObjectId,
        required: true,
        refPath:'onModel'
    },
    // this field is used for efining the type of the liked object since this is a dynamic ref.
    onModel:{
        type:String,
        required:true,
        enum:['Post', 'Comment']
    }
},{
    timestamps:true
});


const Like = mongoose.model('Like', LikeSchema);
module.exports = Like;