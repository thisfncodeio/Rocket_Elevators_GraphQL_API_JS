const { Client } = require('pg')
var client = new Client({
  host: 'codeboxx-postgresql.cq6zrczewpu2.us-east-1.rds.amazonaws.com',
  user: 'akeeb',
  password: 'password',
  database: 'warehouse_development'
});

function pgconnection() {
  return new Promise((resolve, reject) => {
    client.connect(function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result)
    })
  })
}

function pgquery(queryString) {
  return new Promise((resolve, reject) => {
    client.query(queryString, function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    })
  })
}

module.exports = {
  pgquery,
  pgconnection
}