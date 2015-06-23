var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var monk = require('monk');
var faye = require('faye');
var bayeux = new faye.NodeAdapter({
    mount: '/faye',
    timeout: 45
});

var db = monk('localhost:27017/loginsystem');

var jsonParser = bodyParser.json();
var usersCollection = db.get('userscollection');
var emailsCollection = db.get('emailscollection');
var repliesCollection = db.get('repliescollection');

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

app.get('/account', ensureAuthenticated, function(req, res){
  res.send(req.user);
});
app.get('/login', function(req, res){
  res.send("Invalid login.")
});
app.get('/inbox', ensureAuthenticated, function(req, res) {
  var allEmails;
  emailsCollection.find({ $query: {user_to: req.user.email }, $orderby: {_id: -1}}, function(err, emails){
    allEmails = emails;
    res.end(JSON.stringify(allEmails));
  });
});
app.get('/sentemails', ensureAuthenticated, function(req, res) {
  var allEmails;
  emailsCollection.find({$query: { user_from: req.user.email }, $orderby: {_id: -1}}, function(err, emails){
    allEmails = emails;
    res.end(JSON.stringify(allEmails));
  });
});
app.get("/email/:id", ensureAuthenticated, function(req, res) {
  emailsCollection.update({ _id: emailsCollection.id(req.params.id) }, { $set: {read: true}, $currentDate: {lastModified: true} }, function(err, email) {
    if(!err) {
      emailsCollection.findOne({_id: emailsCollection.id(req.params.id)}, function(err, email) {
        res.end(JSON.stringify(email));
      });
    }
  });
});
app.get("/email/:id/replies", ensureAuthenticated, function(req, res) {
   var email_id = req.params.id;
   repliesCollection.find({email_id: email_id}, function(err, replies) {
    res.end(JSON.stringify(replies));
   });  
});
app.get("/search/:query", ensureAuthenticated, function(req, res) {
  var query = req.params.query;
  emailsCollection.find({ subject: {$regex: "/"+query+"/"} }, function(err, emails) {
    res.end(JSON.stringify(emails));
  });
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login.html');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login'}), function(req, res) {
	res.redirect('/account.html');
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
            res.redirect('/login.html');
        }
    });
});
app.post('/compose', ensureAuthenticated, function(req, res) {
	var obj_to_insert = { "user_to" : req.body.user_to_email, "user_from" : req.user.email, "subject" : req.body.subject, "body" : req.body.body, "read": false, "created_at": new Date().getTime() }
  console.log(obj_to_insert);
	var obj_id = 0;
	emailsCollection.insert(obj_to_insert, function(err, email) {
    bayeux.getClient().publish('/inbox', {email: JSON.stringify(email)});
  });
  res.end();
});
app.post('/email/:id/reply', ensureAuthenticated, function(req, res) {
  repliesCollection.insert({ "email_id":req.params.id, "user_email":req.user.email, "reply":req.body.reply }, function(err, reply) {
    bayeux.getClient().publish('/email/'+req.params.id+'/replies', {reply: JSON.stringify(reply)});
  });
  res.end();
});

bayeux.attach(app.listen(3030, function() {}));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
  	return next();
  }
  res.redirect('/login');
}