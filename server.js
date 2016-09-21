//Setup some requires
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var db          = require('./db.js');


// configure app to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8085;        // set port for server
var router = express.Router();   //How we route the urls

var data = db.connect();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.use('/api', router);

app.listen(port);
console.log('Server up on port ' + port);
