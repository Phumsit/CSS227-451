var   express   = require('express'),
app             = express(),
bodyParser      = require('body-parser'),
mongoose        = require('mongoose'),
flash           = require('connect-flash'),
methodOverride  = require('method-override'),
passport        = require('passport'),
LocalStrategy   = require('passport-local'),
Collection      = require('./models/collection'),
Comment         = require('./models/comment'),
User            = require('./models/user'),
seedDB          =  require('./seeds');

var collectionRoutes    = require('./routes/collections'),
commentRoutes       = require('./routes/comments'),
indexRoutes         = require('./routes/index');
mongoose.connect('mongodb://localhost/ShopDatabase');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(flash());

//app.use(express.static(__dirname + 'public'));
app.use(methodOverride('_method'));
app.use(express.static('./public'));

//SeedDB Active

//seedDB();



app.use(require('express-session')({
    secret: ' ',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use('/', indexRoutes);
app.use('/product', collectionRoutes);
app.use('/product/:id/comments', commentRoutes);



app.listen(3000, function(){
    console.log('Server is running');
});    