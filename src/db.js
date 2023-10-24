const { Pool } = require('pg');

const pg = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'univer',
  password: 'root',
  port: 5432,
});

module.exports = {
  query: (text, params) => pg.query(text, params),
};
