var express = require('express'),
    router  = express.Router(),
    User    = require('../models/user'),
    middleware = require('../middleware'),
    multer = require('multer'),
    passport=  require('passport');
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
    res.render('home.ejs');
});

router.get('/register', function(req, res){
    res.render('register.ejs');
});

router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            req.flash('error', err.message)
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success','Register Successfully, Greetings ' + user.username)
            res.redirect('/product');
        });
    });
});

router.get('/login', function(req, res){
    res.render('login.ejs');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/product',
        failureRedirect: '/login',
        successFlash: true,
        failureFlash: true,
        successFlash: 'Success',
        failureFlash: 'Invalid username or password'
    }), function(res, res){       
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success','Logged out Successfully')
    res.redirect('/product');
});

router.get('/account',function(req,res){
    res.render('account.ejs');
})

router.get('/about',function(req,res){
    res.render('about.ejs');
})

router.get('/cart',middleware.isLoggedIn,function(req,res){
    res.render('cart.ejs');
})

router.get('/editacc',function(req,res){
    res.render('editacc.ejs');
})


router.get('/user/:id/edit',middleware.isLoggedIn, function(req,res){ 
    User. findById(req.params.id, function(err, foundUser){
         if(err) {
            console.log(err);
        }else{
            res.render('editacc.ejs', {user: foundUser})
        }
    })
})
router.put('/user/:id', function(req,res){

    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser) {

        if(err){
            res.redirect('back');
            console.log(err);
        
        }else{
            // reg.flash('success', 'Updated Successfully") 
            res.redirect('/user/' + req.params.id); 
            // res.redirect("/");
        }
    });
});




module.exports = router;