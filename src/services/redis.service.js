const Redis = require("ioredis");
const redis = new Redis();


async function redisAdd(key, value, type) {
  switch (type) {
    case 'array':
      await redis.rpush(key, value);
      return redis.lrange(key, 0, -1).then((r) => r);
    default:
      return;
  }
}

async function redisGet(key, type) {
  switch (type) {
    case 'array':

    default:
      return;
  }
}

module.exports = {
  redisAdd,
  redisGet,
}