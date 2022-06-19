// =============== IMPORTS

const postgresService = require('./postgres.service');

// =============== CONSTS

// ===============  MODULE FUNCTIONS

const readGame = async (sessionId) => {
  console.log(`Reading game ${sessionId}`)
  const query = `SELECT * FROM games where session_id = $1`;
  const variables = [sessionId];
  return postgresService.read(query, variables);
}

const writeGame = async (sessionId) => {
  console.log(`Writing game ${sessionId}`)
  const query = `INSERT INTO games(session_id) VALUES ($1)`;
  const variables = [sessionId];
  return postgresService.write(query, variables);
}

const destroyGame = async (sessionId) => {
  console.log(`Destroying game ${sessionId}`)
  const query = `DELETE FROM games where session_id = $1`;
  const variables = [sessionId];
  return postgresService.destroy(query, variables);
};

module.exports = {
  readGame,
  writeGame,
  destroyGame,
}
