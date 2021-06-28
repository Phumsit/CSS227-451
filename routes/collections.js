var express = require('express'),
    router  = express.Router(),
    multer = require('multer'),
    path = require('path'),
    middleware = require('../middleware'),

    storage = multer.diskStorage({
        destination: function(req,file,callback){
            callback(null,'./public/uploads/');
        },
        filename:function(req,file,callback){
            callback(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }

    }),
    imageFilter = function(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
            return callback(new Error('Only specific image type'), false);
        }
        callback(null,true);
    },
    upload = multer({storage: storage, fileFilter: imageFilter}),
    Collection  = require('../models/collection');

router.get('/', function(req, res){
    Collection.find({}, function(err, allCollections){
        if(err){
            console.log(err);
        } else {
            res.render('collections/index.ejs', {collection: allCollections});
        }
    });
});

router.post('/', middleware.isLoggedIn, upload.single('image'), function(req, res){
    req.body.collection
    req.body.collection.image = '/uploads/'+req.file.filename;
    // var name = req.body.name;
    // var image = req.body.image;
    // var desc = req.body.desc;
    // var pr = req.body.pr;
    // var qty = req.body.qty;
    req.body.collection.author = {
        id: req.user._id,
        username: req.user.username
    };
    //var newCollection = {name:name, image:image, desc: desc, pr:pr, qty:qty, author: author};
    Collection.create(req.body.collection, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            req.flash('success', 'Product Listed')
            res.redirect('/product');
        }
    });
});

router.get('/new', middleware.isLoggedIn, function(req,res){
    res.render('collections/new.ejs');
});

router.get("/:id", function(req, res){
    Collection.findById(req.params.id).populate('comments').exec(function(err, foundCollection){
        if(err){
            console.log(err);
        } else {
            res.render("collections/show.ejs", {collection: foundCollection});
        }
    });
});

router.get('/:id/edit',middleware.checkOwner, function(req,res){
    Collection.findById(req.params.id, function(err, foundCollection){
        if(err){
            console.log(err);
        }else{
            res.render('collections/edit.ejs', {collection: foundCollection})
        }
    })
})

router.put('/:id', upload.single('image'), function(req,res){
    
    if(req.file){
        req.body.collection.image = '/uploads/'+ req.file.filename;
        console.log(req.body.collection);
    }

    Collection.findByIdAndUpdate(req.params.id, req.body.collection, function(err,updatedCollection){
        if(err){
            //res.redirect('/product/' + req.params.id +'/edit' );
            console.log(err);
        }else{
            req.flash('success', 'Updated Successfully')
            res.redirect('/product/' + req.params.id);
        }
    });
});

router.delete('/:id', middleware.checkOwner,function(req,res){
    Collection.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/product/');
        }else{
            req.flash('success', 'Deleted Successfully')
            res.redirect('/product/');
        }
    })
})

router.post('/search', function (req, res) {
    var name = req.body.search;
    var type = req.body.type;
    res.redirect('/product/search/' + name);

});

router.get('/search/:name', function (req, res,) {
    var name = req.params.name
    Collection.find({ name: new RegExp(name, 'i')}, function (err, allCollection) {
        if (err) {
            console.log(err);
        } else {
            res.render('collections/index.ejs',{collection: allCollection})

        }
    })

});

router.get('/Type/:a', function (req, res,) {
    var name = req.params.a
    Collection.find({ category : new RegExp(name, 'i')}, function (err, allCollection) {
        if (err) {
            console.log(err);
        } else {
            res.render('collections/index.ejs',{collection: allCollection})

        }
    })

});

module.exports = router;