var fs = require('fs');
var qs = require('querystring');
var express = require('express');
var app = express();

var client_id = '98ad42fc81564a52b3bb9025563f04e7';
var client_secret = '6c3bb2e76b854cb0a21ad6aed23f9d61';

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret
});

var accessToken;

const jssdkscopes = ["streaming", "user-read-birthdate", "user-read-email", "user-read-private", "user-modify-playback-state"];
const redirectUriParameters = {
  client_id: client_id,
  response_type: 'token',
  scope: jssdkscopes.join(' '),
  redirect_uri: encodeURI('http://localhost:8888/login.html'),
  show_dialog: true,
}

const redirectUri = `https://accounts.spotify.com/authorize?${qs.stringify(redirectUriParameters)}`;

function authenticate(callback) {
  spotifyApi.clientCredentialsGrant()
    .then(function(data) {
      console.log('The access token expires in ' + data.body['expires_in']);
      console.log('The access token is ' + data.body['access_token']);
      
      let valid = data.body['access_token'];
      fs.writeFile('validation.txt', valid, (err) => {
        if (err) throw err;
        console.log('Successfully saved access token');
        
      })

      callback instanceof Function && callback();

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body['access_token']);
      accessToken = data.body['access_token'];
    }, function(err) {
      console.log('Something went wrong when retrieving an access token', err.message);
    });
}
authenticate();

app.use(express.static('./'));

app.get("/spotifyRedirectUri", function (req, res) {
  res.send(JSON.stringify({
    redirectUri
  }, null, 2))
});

var listener = app.listen(8888, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
