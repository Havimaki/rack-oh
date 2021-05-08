const Redis = require("ioredis");
const redis = new Redis();

global.afterEach(() => {
  redis.flushdb();
});

describe('redis', () => {
  it('should be up', () => {
    expect(redis).toBeDefined();
  });
})