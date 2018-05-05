const Post = require("../models/UserPost");




module.exports = {
    new: (req, res) => {
        Post.findOne({ _id: req.body.post_id})
        .exec((err, post) => {
            if(err){
                throw err;
            }
            
            if(post){
                post.post_comments.push({comment_from: req.body.id, comment_text: req.body.comment});
                post.save();
                res.send({message: 'Comment success', code: 200})
            }
            
        }) 
    } 
};