const { createClient } = require('redis');
const { Client } = require("pg");
const redis = createClient({
  host: 'redis',
  port: 6379
});
const postgres = new Client({
  user: 'root',
  host: 'postgres',
  password: 'root',
  port: 5432,
  database: 'rackoh'
});

global.afterEach(() => {
  redis.end(true)
  postgres.end()
});

describe('redis', () => {
  it('should be up', () => {
    expect(redis).toBeDefined();
  });
})