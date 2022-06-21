// =============== IMPORTS

const postgresService = require('./postgres.service');

// =============== CONSTS

// ===============  MODULE FUNCTIONS

const readDeck = async (sessionId) => {
  console.log(`Reading to deck ${sessionId}`);
  const query = `SELECT * FROM games where session_id = $1`;
  const variables = [sessionId];
  return postgresService.read(query, variables);
}

const writeDeck = async (sessionId) => {
  console.log(`Writing to deck ${sessionId}`);
  const query = `INSERT INTO games(session_id) VALUES ($1)`;
  const variables = [sessionId];
  return postgresService.write(query, variables);
}

const destroyDeck = async (sessionId) => {
  console.log(`Destroying to deck ${sessionId}`);
  const query = `DELETE FROM games where session_id = $1`;
  const variables = [sessionId];
  return postgresService.destroy(query, variables);
};

module.exports = {
  readDeck,
  writeDeck,
  destroyDeck,
}
