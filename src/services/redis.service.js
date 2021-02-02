const Redis = require("ioredis");
const redis = new Redis();


async function redisAdd(key, value, type) {
  switch (type) {
    case 'array':
      await redis.rpush(key, value);
      break;
    default:
  }
}

async function redisGet(key, type) {
  switch (type) {
    case 'array':
      await redis.lrange(key, 0, -1).then((r) => console.log(key, r));
      break;
    default:
  }
}

module.exports = {
  redisAdd,
  redisGet,
}