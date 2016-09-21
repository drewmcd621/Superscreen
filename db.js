//Setup some requires
var fs          = require('fs');

//Grab our secrets from a JSON file
var secret = JSON.parse(fs.readFileSync('secret.json', 'utf8'));

exports.connect = function()
{
  var user = secret.database.user;
  var pw = secret.database.password;

  var sequelize = new Sequelize('screen', user, pw, {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  });

  return sequelize;
}
