// =============== IMPORTS
const Redis = require("ioredis");
const redis = new Redis();


async function redisAdd(sessionId, key, value, dataType) {
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

async function redisGet(sessionId, key, dataType) {
  switch (dataType) {
    case 'array':
      return redis.lrange(key, 0, -1).then((r) => r);
    case 'object':
      return redis.hgetall(sessionId).then((r) => r);
    default:
      return;
  }
}

async function redisDelete(key) {
  return redis.del(key);
}

module.exports = {
  redisAdd,
  redisGet,
  redisDelete,
}