var client_id = '98ad42fc81564a52b3bb9025563f04e7';
var client_secret = '6c3bb2e76b854cb0a21ad6aed23f9d61';
var redirect_uri = 'localhost:8888/callback';

var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri
});
spotifyApi.setAccessToken('BQBAKJgiGn1K3B-CH13tGDz4YsyBo_QMfjCydK3EWMa8RvP0aVh3Y8dFPSO5aoxmoZp63ErNh4l-9JoxeefojoGOcGK5H2DryIbN4HDaqzkE1O--Eq5CX3swgjkxVXmWNoEtul_jsBIh_iJFTdBxzLL5XboqKLlUkIQ-Ew');


global.drawCircle = function  (event) {
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

  var recommended = spotifyApi.getRecommendations(
    {
      seed_genres: 'country'
    }
  ).then(function(data) { 
    console.log(data);  
  }, function(err) {
    console.log(err);
  });
  // console.log(recommended);
  // spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
  //   function(data) {
  //     console.log('Artist albums', data.body);
  //   },
  //   function(err) {
  //     console.error(err);
  //   }
  // );

}
