var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var monk = require('monk');
var db = monk('mongodb://<angularblog>:<programming123>@ds039000.mongolab.com:39000/angularblog');

var jsonParser = bodyParser.json();
var usersCollection = db.get('userscollection');
var blogsCollection = db.get('blogscollection');

function findById(id, fn) {
	usersCollection.findOne({ _id: id }, function(err, user) {
		fn(null, user);
	});
}

function findByUsername(username, fn) {
	usersCollection.findOne({ username: username }, function(err, user) {
		fn(null, user);
	});
}

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({  
  secret: 'keyboard cat'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use(express.static(__dirname + '/public'));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
      return done(null, user);
    })
  }
));
app.get('/blogs', ensureAuthenticated, function(req, res) {
  blogsCollection.find({}, function(err, blogs) {
    res.end(JSON.stringify(blogs));
  });
});
app.get('/blog/:id', ensureAuthenticated, function(req, res) {
  blogsCollection.findOne({_id : blogsCollection.id(req.params.id)}, function(err, blog) {
    res.end(JSON.stringify(blog));
  });
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/#/login');
});
app.post('/login', passport.authenticate('local', { failureRedirect: '/login'}), function(req, res) {
	res.redirect('/#/blogs');
});
app.post('/register', function(req, res) {
	usersCollection.insert({
        "username" : req.body.username,
        "email" : req.body.email,
        "password" : req.body.password
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        }
        else {
            res.redirect('/#/login');
        }
    });
});
app.post('/blog/create', ensureAuthenticated, function(req, res) {
  blogsCollection.insert({
    title: req.body.title,
    description: req.body.description,
    date: new Date(),
    by: req.user.username
  });
  res.redirect("/#/blogs");
});

var port = process.env.PORT || 3001;

app.listen(port);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return next();
  }
  res.redirect('/#/login');
}
