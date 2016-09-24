//Setup server
var express     = require('express');
var app         = express();
var path = require('path');

var port = process.env.PORT || 8086;        // set port for server


//Setup socket
var http = require('http').Server(app);
var io = require('socket.io')(http);



//Setup demo
var request = require('request');

var apiDomain = "www.flyingkiwibird.com:8085";
var domain = "www.flyingkiwibird.com:8086";

//Setup
request("http://" + apiDomain + "/api/setup", function(err, resp, body) {
  console.log(body);

  //Register screens
  request({url: "http://" + apiDomain + "/api/register", qs:{name:"screen1", x:0, y:0, callback:"http://" + domain + "/receive/screen1"}}, function(err, resp, body) {
    console.log(body);
  });
  request({url: "http://" + apiDomain + "/api/register", qs:{name:"screen2", x:1, y:0, callback:"http://" + domain + "/receive/screen2"}}, function(err, resp, body) {
    console.log(body);
  });
  request({url: "http://" + apiDomain + "/api/register", qs:{name:"screen3", x:0, y:1, callback:"http://" + domain + "/receive/screen3"}}, function(err, resp, body) {
    console.log(body);
  });
  request({url: "http://" + apiDomain + "/api/register", qs:{name:"screen4", x:1, y:1, callback:"http://" + domain + "/receive/screen4"}}, function(err, resp, body) {
    console.log(body);
  });

});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

//Handles the transmit messages and sends them via socket.io
app.get('/receive/:name', function (req, res)
{
  io.emit('newObj', {name: req.params.name, object:req.query});
});

app.get('/display', function (req, res)
{
  var name = req.query.name;
  res.sendFile(path.join(__dirname + '/screens/simple.html'));
});


/** Sockets **/
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('handshake', function(msg){
    console.log(msg);
  });


});


/** Ears on **/
http.listen(port, function() {
  console.log("Server up on " + port);
});
