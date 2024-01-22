const promise = require('bluebird');
const options = {
    promiseLib: promise,
    query: (e) => {}
};

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;

types.setTypeParser(1114, function(stringValue) {
    return stringValue;
});

const db_user = 'postgres';
const db_pass = '27266291Ab*';
const db_host = 'localhost';
const db_name = 'delivery_app';
const db_port = '5432';

const databaseConf = {
    'host': db_host,
    'port': db_port,
    'database': db_name,
    'user': db_user,
    'password': db_pass,
};

const db = pgp(databaseConf);

module.exports = db;
