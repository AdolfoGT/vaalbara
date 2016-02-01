var express = require('express');
var app = express();
var fileSystem = require('fs'),
    path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Twit = require('twit');
var config = require('./config');

var T = new Twit(config.twitter);

function tweetProcessing(tweet) {
  // TODO transform text-to-speech with google api
  console.log(tweet.text);
  console.log(tweet.user.url);
  console.log(tweet.user.name);
  console.log(tweet.user.profile_image_url);
  io.emit('new tweet', tweet);
  //console.log("new tweet!")
}

// coord = [west, south, east, north]
var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]
console.log("creating stream ...");
stream = T.stream('statuses/filter', { locations: sanFrancisco });

stream.on('tweet', tweetProcessing);

//stream.stop();
//stream.start()
// {sw_lat: 36.8, sw_lon: -122.75, ne_lat: 37.8, ne_lon: -121.75}
var newLoc = function(loc) {
  stream.stop();
  console.log("creating stream with newLoc ...");
  var coords = [loc.sw_lon, loc.sw_lat, loc.ne_lon, loc.ne_lat];
  console.log("setting new coords.", coords);
  stream = T.stream('statuses/filter', { locations: coords });
  stream.on('tweet', tweetProcessing);
  console.log("starting stream ...");
}

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

// curl http://localhost:3000/loc/sw/36.8/-122.75/ne/37.8/-121.75
app.get('/loc/sw/:sw_lat/:sw_lon/ne/:ne_lat/:ne_lon', function (req, res) {
  console.log(req.params);
  newLoc(req.params);
  res.send('Hello World!');
});


app.use(express.static('js'));
app.use(express.static('css'));
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
      console.log('user disconnected');
      stream.stop();
  });
  socket.on('chat message', function(msg){
     console.log('message: ' + msg);
   });
  socket.on('change coords.', function(msg){
    console.log('change coords: ' + msg);
    newLoc(msg);
  });
   
});


http.listen(3000, function(){
  console.log('Example app listening on port 3000!');
  console.log("stopping stream ...");
  stream.stop()
});