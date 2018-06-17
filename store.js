var redis = require("redis"),
  client = redis.createClient();

client.select(1);

const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);
const keysAsync = promisify(client.keys).bind(client);
const setAsync = promisify(client.set).bind(client);
const saddAsync = promisify(client.sadd).bind(client);
const smembersAsync = promisify(client.smembers).bind(client);

const buildTokenKey = id => `id:${id}`;
const buildRulesKey = id => `rules:${id}`;

client.on("error", function(err) {
  console.log("Error " + err);
});

function get_token(id) {
  return getAsync(buildTokenKey(id)).then(res => JSON.parse(res));
}

function save_token(id, access_token, refresh_token) {
  setAsync(
    buildTokenKey(id),
    JSON.stringify({ access_token, refresh_token })
  ).then(res => {
    console.log(res);
  });
}

function add_rule(id, rule) {
  return saddAsync(buildRulesKey(id), rule.toLowerCase()).then(res => {
    console.log(res);
  });
}

function get_rules(id) {
  return smembersAsync(buildRulesKey(id));
}

function get_users() {
  return keysAsync(buildTokenKey("*")).then(users =>
    users.map(user => user.split(":")[1])
  );
}

module.exports = {
  save_token,
  get_token,
  add_rule,
  get_rules,
  get_users
};
