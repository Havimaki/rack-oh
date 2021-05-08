const Redis = require("ioredis");
const redis = new Redis();

global.afterEach(() => {
  redis.flushdb();
});