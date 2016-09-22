//Setup some requires
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var db          = require('./db.js');
var Screen      = require("./app/models/screen.js");

// configure app to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8085;        // set port for server
var router = express.Router();   //How we route the urls

var data = db.connect();
var

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the screen supervisor' });
});

router.get('/register', function(req, res) {
    var x = req.query.x;
    var y = req.query.y;
    var callback = req.query.callback;

    res.json({ x: x, y: y, callback: callback });
});

app.use('/api', router);

app.listen(port);
console.log('Server up on port ' + port);
