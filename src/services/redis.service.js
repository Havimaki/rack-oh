// =============== IMPORTS

const Redis = require("ioredis");
const redis = new Redis();

// ===============  MODULE FUNCTIONS

async function create(sessionId, key, value, dataType) {
  switch (dataType) {
    case 'array':
      await redis.rpush(key, value);
      return redis.lrange(key, 0, -1).then((r) => r);
    case 'object':
      await redis.hset(sessionId, [key, value]);
      return redis.hgetall(sessionId).then((r) => r);
    default:
      return;
  }
}

async function update(sessionId, key, value, dataType) {
  switch (dataType) {
    case 'array':
    case 'object':
      await redis.hmset(sessionId, [key, value]);
      return redis.hgetall(sessionId).then((r) => r);
    default:
      return;
  }
}

async function read(sessionId, key, dataType) {
  switch (dataType) {
    case 'array':
      return redis.lrange(key, 0, -1).then((r) => r);
    case 'object':
      return redis.hgetall(sessionId).then((r) => r);
    default:
      return;
  }
}

async function hardDelete(key) {
  return redis.del(key);
}

module.exports = {
  create,
  update,
  read,
  hardDelete,
};