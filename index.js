var SpotifyWebApi = require('spotify-web-api-node');
var {client_id, client_secret} = require('../secrets.js')

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: 'http://www.example.com/callback'
});

// spotifyApi.getMyCurrentPlaybackState({
// })
// .then(function(data) {
//   // Output items
//   console.log("Now Playing: ",data.body);
// }, function(err) {
//   console.log('Something went wrong!', err);
// });

/**
 * This example retrieves information about the 'current' user. The current user is the user that has
 * authorized the application to access its data.
 */

// First retrieve an access token
spotifyApi
  .authorizationCodeGrant(authorizationCode)
  .then(function(data) {
    console.log('Retrieved access token', data.body['access_token']);

    // Set the access token
    spotifyApi.setAccessToken(data.body['access_token']);

    // Use the access token to retrieve information about the user connected to it
    return spotifyApi.getMe();
  })
  .then(function(data) {
    // "Retrieved data for Faruk Sahin"
    console.log('Retrieved data for ' + data.body['display_name']);

    // "Email is farukemresahin@gmail.com"
    console.log('Email is ' + data.body.email);

    // "Image URL is http://media.giphy.com/media/Aab07O5PYOmQ/giphy.gif"
    console.log('Image URL is ' + data.body.images[0].url);

    // "This user has a premium account"
    console.log('This user has a ' + data.body.product + ' account');
  })
  .catch(function(err) {
    console.log('Something went wrong', err.message);
  });