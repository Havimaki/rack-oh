// Run flyway migration
const { execSync } = require('child_process');

const config = require('./config.js');

let migrateCommand = `flyway -locations="filesystem:./db/sql" -user=${config.PSQL_USERNAME} -password=${config.PSQL_PASSWORD} -url=jdbc:postgresql://${config.PSQL_HOST}:${config.PSQL_PORT}/rackoh migrate -outputType=json`;

const migrate = () => {
  try {
    console.log('Run migrations result:', execSync(migrateCommand).toString());
  } catch (err) {
    console.error('Error stderr', err);
  }
};

module.exports = {
  migrate
};