var Collection = require('../models/collection');
const Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Collection.findById(req.params.id, function(err, foundCollection){
            if(err){
                req.flash('error','Product not found')
                res.redirect('back')
            }else{
                if(foundCollection.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash('error','You do not have permission to do this')
                    res.redirect('back')
                }
            }
        })
    }else{
        req.flash('error','Please sign-in to continue!')
        res.redirect('back');
    }

}

middlewareObj.checkCommentOwner = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash('error','comment not found!')
                res.redirect('back')
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash('error','You do not have permission to do this')
                    res.redirect('back')
                }
            }
        })
    }else{
        req.flash('error','Please sign-in to continue!')
        res.redirect('back');
    }

}


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error','Please sign-in to continue!')
    res.redirect('/login');
}

module.exports = middlewareObj;