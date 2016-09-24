//Setup some requires
var express     = require('express');
var app         = express();

var db          = require('./db.js');
var Scr      = require("./app/models/screen.js");


var port = process.env.PORT || 8085;        // set port for server
var router = express.Router();   //How we route the urls

var datab = db.connect();



/********** Load models ****/
var Screen = Scr(datab);

datab.sync({force: true}).then(function(){
  console.info("DB ready!");
})

router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the screen supervisor' });
});

//Setup a new sysyem (clear the database)
router.get('/setup', function(req, res) {

  Screen.truncate().then(function (scr){
    res.json({success: 1});
  }).catch(function (err)
  {
    res.json({success:0, error: err.message});
  });

});

//Register a screen
router.get('/register', function(req, res) {
  var name = req.query.name;
  var x = req.query.x;
  var y = req.query.y;
  var callback = req.query.callback;


  Screen.create({
    name: name,
    x: x,
    y: y,
    callback: callback
  }).then(function (scr){
    res.json({success: 1, id: scr.id});
  }).catch(function (err)
  {
    res.json({success:0, error: err.message});
  });

});

//Send an object
router.get('/transmit', function(req, res) {
  var screenName = req.query.name;

  Screen.findOne({
    where: {
      name: screenName
    }
  }).then(function(scr){
    var to = req.query.to; // U(p), D(own), L(eft), R(ight)

    var params = {};

    params['left'] = req.query.left; // distance from left of the screen / total screen width
    params['top'] = req.query.top; // distance from top of the screen / total screen height

    params['xspeed'] = req.query.xspeed;  //Speed in X direction (% of horizontal screen / s^2)
    params['yspeed'] = req.query.yspeed;  //Speed in Y direction (% of vertical screen / s^2)

    params['xaccel'] = req.query.xaccel;  //Acceleration in the X direction (% of horizontal screen / s^2)
    params['yaccel'] = req.query.yaccel;  //Acceleration in the Y direction (% of vertical screen / s^2)


    params['info'] = req.query.info //JSON structured data to be passed between screens with the item, can be anything really

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
    var nX = scr.x + dx;
    var nY = scr.y + dy;
    Screen.findOne({
      where: {
        x: nX,
        y: nY
      }
    }).then(function(newScr){

      if(newScr)
      {
        //Found, a screen let's send it
        var request = require('request');
        var url = newScr.callback;
        //Send to the callback URL of the new screen
        request({url: url, qs: params}, function(err, resp, body)
        {
          if(err) {
            console.error(err);
            res.json({success:0, error: "Error when transmitting", detail: err});
          }
          if(resp.statusCode == 200)
          {
            res.json({success:1, sent:1, newScreen: newScr.id, response: body}); //Everything went well
          }
          else {
            res.json({success:0, error: "Error when transmitting", code: resp.statusCode});
          }
        });

      }
      else
      {
        res.json({success:1, sent:0, message:"No screen at ( " + nX + " , " + nY + " )" });
      }


    }).catch(function (err)
    {
      res.json({success:0, error: err.message});
      //TODO: handle a "not found" error
    });
  }).catch(function (err)
  {
    res.json({success:0, error: err.message});
  });



});

//Echo to display callback code
router.get('/echo', function(req, res) {
  res.json({success: 1, info: req.query.info});
});

app.use('/api', router);

app.listen(port, function(){
  console.log('Server up on port ' + port);
});
