var redis = require('redis'), client = redis.createClient();

const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const buildIdKey = id => `id:${id}`

client.on('error', function(err) {
  console.log('Error ' + err);
});


client.set('foo', 'bar', redis.print);

// We expect a value 'foo': 'bar' to be present
// So instead of writing client.get('foo', cb); you have to write:
getAsync('foo').then(function(res) {
  console.log(res);  // => 'bar'
});

function save_token(id, access_token, refresh_token) {
  setAsync(buildIdKey(id), JSON.stringify({access_token,refresh_token})).then(res => {console.log(res)})
}


module.exports ={save_token}