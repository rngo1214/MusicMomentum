var client_id = '98ad42fc81564a52b3bb9025563f04e7';
var client_secret = '6c3bb2e76b854cb0a21ad6aed23f9d61';

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret
});

var recommended;
var credentials;
var deviceId;
var uri;
var title;
var artist;
var imgUrl;
var songId;

function readTextFile(file)
{
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4) {
      if(rawFile.status === 200 || rawFile.status == 0) {
        credentials = rawFile.responseText;
        console.log(credentials);
      }
    }
  }
  rawFile.send(null);
}
readTextFile('validation.txt');

spotifyApi.setAccessToken(credentials);

window.onSpotifyWebPlaybackSDKReady = () => {
      
}
function onSpotifyPlayerAPIReady() {
  player = new Spotify.Player({
    name: 'Music Momentum Player',
    getOauthToken: function (callback) { callback(credentials); } 
  });
  player.on('ready', function (data) {
    deviceId = data.device_id;
    console.log('hi', deviceId);
    
    setTimeout(() => {
      fetch('https://api.spotify.com/v1/me/player', {
        method: "PUT",
        body: JSON.stringify({
          device_ids:[
            data.device_id
          ], play: false
          }),
        headers: {
          'Authorization': `Bearer ${credentials}`
        }}).catch(e => console.error(e));
    }, 100);
  });
  player.connect().then(success => {
  if (success) {
    console.log('The Web Playback SDK successfully connected to Spotify!');
  }
})
};

global.drawCircle = function (event) {
  var canvas = document.getElementById("circlecanvas");
  var context = canvas.getContext("2d");
  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
  x = event.pageX;
  y = event.pageY;
  
  context.fillStyle = "white";
  context.beginPath();
  context.arc(x, y, 10, 0, Math.PI * 2, false);
  context.fill();

  recommended = spotifyApi.getRecommendations(
    {
      limit: 10,
      seed_genres: 'country'
    }
  ).then(function(data) { 
    recommended = data;
    randNum = Math.floor(Math.random() * 10);
    console.log(recommended);  
    console.log(recommended.body.tracks[randNum].uri);
    title = recommended.body.tracks[randNum].name;
    artist = recommended.body.tracks[randNum].artists[0].name;
    imgUrl = recommended.body.tracks[randNum].album.images[0].url;
    uri = recommended.body.tracks[randNum].uri
    songId = recommended.body.tracks[randNum].id;
    console.log(title, artist, imgUrl, uri);
    
    document.getElementById('song').innerHTML = title;
    document.getElementById('artist').innerHTML = artist;
    document.getElementById('album_placeholder').src= imgUrl;
    
    function playback(id) {
      let query = '/analysis?id=' + id;
      
      console.log('test', deviceId, uri, credentials);
      return fetch(query).then(e => e.json()).then(data => {
        fetch(`https://api.spotify.com/v1/me/player/play${deviceId && `?device_id=${deviceId}`}`, {
        method: "PUT",
        body: JSON.stringify({
          "uris": uri
        }),
        headers: {
          'Authorization': `Bearer ${credentials}`
        }}).catch(e => console.error(e)); 
      });
    }
    playback(songId);
  }, function(err) {
    console.log(err);
  });
  
}
