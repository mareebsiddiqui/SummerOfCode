var express = require('express'),
    multer  = require('multer')

var app = express();
app.use(multer({ dest: '../music/'}));

app.use(express.static(__dirname + '/public'));

app.post('/music', function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files
    res.status(204).end();
});

app.listen(3030, function() {
	console.log("Listening...");
});