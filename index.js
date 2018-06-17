var SpotifyWebApi = require("spotify-web-api-node");
var { client_id, client_secret } = require("./secrets.js");
var { save_token, get_token, get_users, get_rules } = require("./store.js");

function extract_strings(data) {
  let item = data.body.item;
  let name = item.name;
  let album = item.album.name;
  let artist_names = item.artists.map(({ name }) => name);
  return [name, album, ...artist_names].join(" | ").toLowerCase();
}

function refresh_auth(user_id) {
  return get_token(user_id).then(({ access_token, refresh_token }) => {
    var spotifyApi = new SpotifyWebApi({
      clientId: client_id,
      clientSecret: client_secret,
      redirect_uri: "http:localhost:8000/callback/"
    });
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    return spotifyApi
      .refreshAccessToken()
      .then(data => {
        spotifyApi.setAccessToken(data.body.access_token);
        save_token(
          user_id,
          data.body.access_token,
          data.body.refresh_token || refresh_token
        );
        return spotifyApi;
      })
      .catch(err => console.log(err));
  });
}

function poll_playback(user_id) {
  console.log("polling: ", user_id);
  refresh_auth(user_id).then(spotifyApi => {
    spotifyApi.getMyCurrentPlaybackState({}).then(
      function(data) {
        let playing = extract_strings(data);
        console.log("Now Playing: ", playing);
        get_rules(user_id).then(rules => {
          if (rules.some(rule => playing.indexOf(rule) !== -1)) {
            spotifyApi.skipToNext();
          }
        });
      },
      function(err) {
        console.log("Something went wrong!", err);
      }
    );
  });
}

function poll_all() {
  get_users().then(users => users.forEach(poll_playback));
}
poll_all();
setInterval(poll_all, 1000 * 30);
