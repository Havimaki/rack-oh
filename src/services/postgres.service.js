// ===============  IMPORTS

const { Client } = require("pg");

// ===============  INITIALIZATION

const postgres = new Client({
  user: 'root',
  host: 'postgres',
  password: 'root',
  port: 5432,
  database: 'rackoh'
});

postgres.connect();
postgres.on('connect', () => console.log('Postgres client connected!'));
postgres.on('error', (err) => console.log('Postgres Client Error!!', err));
postgres.on('end', () => console.log('postgres Client ending'))

// ===============  MODULE FUNCTIONS
