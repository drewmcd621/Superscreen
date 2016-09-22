//Setup some requires
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var db          = require('./db.js');
var Scr      = require("./app/models/screen.js");

// configure app to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8085;        // set port for server
var router = express.Router();   //How we route the urls

var datab = db.connect();

/********** Load models ****/
var Screen = Scr(datab);

router.get('/', function(req, res) {
    res.json({ message: 'Welcome to the screen supervisor' });
});

//Register a screen
router.get('/register', function(req, res) {
    var x = req.query.x;
    var y = req.query.y;
    var callback = req.query.callback;

    try
    {
        data.sync().then(function() {
          Screen.create({
            x: x,
            y: y,
            callback: callback
          }).then(function (scr){
            console.log(scr);
          })
          res.json({ x: x, y: y, callback: callback });
        });
    }
    catch(err)
    {
      res.json({error: err.message});
    }

});

//Send an object
router.get('/transmit', function(req, res) {
    var screenID = req.query.screen;

    var curScr = Screen.findAll({
      where: {
        id: screenID
      }
    });

    console.log(curScr);
    //TODO: Possibly get x/y from screen ID or hash rather than relying on screen for accurate info

    var to = req.query.to; // U(p), D(own), L(eft), R(ight)

    var left = req.query.left; // distance from left of the screen / total screen width
    var top = req.query.top; // distance from top of the screen / total screen height

    var xspeed = req.query.xspeed;  //Speed in X direction (% of horizontal screen / s^2)
    var yspeed = req.query.yspeed;  //Speed in Y direction (% of vertical screen / s^2)

    var xaccel = req.query.xaccel;  //Acceleration in the X direction (% of horizontal screen / s^2)
    var yaccel = req.query.yaccel;  //Acceleration in the Y direction (% of vertical screen / s^2)


    var data = req.query.data //JSON structured data to be passed between screens with the item, can be anything really

    var sender;
    var dx = 0;
    var dy = 0;

    //TODO: Validate inputs
    if(to == "U")
    {
      top = 0;
      sender = "D";
      dy = -1;
    }
    else if(to == "D")
    {
      top = 1;
      sender = "U";
      dy = 1;
    }
    else if (to == "L")
    {
      left = 0;
      sender = "R";
      dx = -1;
    }
    else if(to == "R")
    {
      left = 1;
      sender = "L";
      dx = 1;
    }
    else {
      res.json({ success: 0, error: '"to" must be in (U, D, L, R)' });
    }

    //TODO: Determine if left/top should decide which screen to go to

    var newScr = Screen.findAll({
      where: {
        x: xscreen + dx,
        y: yscreen + dy
      }
    });

    console.log(newScr);



});



app.use('/api', router);

app.listen(port);
console.log('Server up on port ' + port);
