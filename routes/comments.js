var express = require('express'),
    router  = express.Router({mergeParams: true}),
    Collection = require('../models/collection'),
    middleware = require('../middleware'),
    Comment    = require('../models/comment');

router.get('/new', middleware.isLoggedIn, function(req, res){
    Collection.findById(req.params.id, function(err, foundCollection){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new.ejs", {collection: foundCollection});
        }
    });    
});

router.post('/', middleware.isLoggedIn, function(req, res){
    Collection.findById(req.params.id, function(err, foundCollection){
        if(err){
            console.log(err);
            res.redirect('/product');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCollection.comments.push(comment);
                    foundCollection.save();
                    res.redirect('/product/'+ foundCollection._id);
                }
            });
        }
    });
});

router.get('/:comment_id/edit', middleware.checkCommentOwner, function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect('back')
        }else{
            res.render('comments/edit.ejs',{collection_id: req.params.id, comment: foundComment })
        }
    })
})


router.put('/:comment_id', middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
        if(err){
            res.redirect('back')
        }else{
            req.flash('success', 'Updated Succesfully')
            res.redirect('/product/'+req.params.id)
        }
    })
})

router.delete('/:comment_id',middleware.checkCommentOwner,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back');
        }else{
            req.flash('success', 'Deleted Succesfully')
            res.redirect('/product/'+req.params.id);
        }
    })
})


module.exports = router;