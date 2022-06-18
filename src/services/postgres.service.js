const { Client } = require("pg");
const postgres = new Client({
  user: 'root',
  password: 'root',
  port: 5432,
  host: 'postgres',
  database: 'rackoh'
});

// ===============  INITIALIZATION

postgres.on('connect', () => console.log('Postgres Client connected!'))
postgres.on('error', () => console.log('Postgres Client connected!'))

postgres.connect();

// ===============  MODULE FUNCTIONS
