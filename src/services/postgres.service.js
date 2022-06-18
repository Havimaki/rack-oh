const { Client } = require("pg");
const postgres = new Client({
  user: 'root',
  host: 'postgres',
  password: 'root',
  port: 5432,
  database: 'rackoh'
});

postgres.connect();
