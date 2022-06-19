const { Client } = require("pg");
const postgres = new Client({
  user: process.env.DB_USER,
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

const read = async (query, variables) => {
  try {
    const res = await postgres.query(query, variables);
    return res.rows;
  } catch (err) {
    console.error(e.stack)
  }
}

const write = async (query, variables) => {
  try {
    const res = await postgres.query(query, variables);
    return res.rows;
  } catch (err) {
    console.error(e.stack)
  }
}

const destroy = async (query, variables) => {
  try {
    const res = await postgres.query(query, variables);
    return res.rows;
  } catch (err) {
    console.error(e.stack)
  }
}

module.exports = {
  read,
  write,
  destroy,
}
