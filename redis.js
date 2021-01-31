const Redis = require("ioredis");
const redis = new Redis();


async function redisAdd(key, value, type) {
  switch (type) {
    case 'array':
      console.log(key, value)
      await redis.sadd(key, value)
      break;
    default:
  }
}

function redisGet(key, type) {
  switch (type) {
    case 'array':
      redis.smembers(key).then((r) => console.log(key, r));
      break;
    default:
  }
}

module.exports = {
  redisAdd,
  redisGet,
}