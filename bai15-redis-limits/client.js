const redis = require("redis");
const { performance } = require("perf_hooks");

const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: (options) => {
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  },
});

client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

client.on("ready", () => {
  console.log("✅ Connected to Redis!");
  console.log(`📍 Host: ${redisHost}:${redisPort}`);
  runTests();
});

async function runTests() {
  try {
    console.log("\n📊 Running Redis Tests...\n");

    // Test 1: Basic SET/GET
    console.log("Test 1: Basic SET/GET Operations");
    client.set("test_key", "Hello Redis!", (err) => {
      if (err) console.error(err);
      else console.log("✅ SET operation successful");
    });

    client.get("test_key", (err, reply) => {
      if (err) console.error(err);
      else console.log(`✅ GET operation: ${reply}\n`);
    });

    // Test 2: Store object
    console.log("Test 2: Store Complex Data");
    const userData = JSON.stringify({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      createdAt: new Date().toISOString(),
    });

    client.set("user:1", userData, (err) => {
      if (err) console.error(err);
      else console.log("✅ Stored user object");
    });

    client.get("user:1", (err, reply) => {
      if (err) console.error(err);
      else {
        const user = JSON.parse(reply);
        console.log(`✅ Retrieved user: ${user.name} (${user.email})\n`);
      }
    });

    // Test 3: Lists
    console.log("Test 3: List Operations");
    const items = ["item1", "item2", "item3", "item4", "item5"];

    client.del("mylist", (err) => {
      items.forEach((item) => {
        client.rpush("mylist", item, (err) => {
          if (err) console.error(err);
        });
      });
    });

    client.lrange("mylist", 0, -1, (err, reply) => {
      if (err) console.error(err);
      else {
        console.log(`✅ List items: ${reply.join(", ")}\n`);
      }
    });

    // Test 4: Set operations
    console.log("Test 4: Set Operations");
    const tags = ["docker", "redis", "cache", "database"];

    client.del("tags", (err) => {
      tags.forEach((tag) => {
        client.sadd("tags", tag, (err) => {
          if (err) console.error(err);
        });
      });
    });

    client.smembers("tags", (err, reply) => {
      if (err) console.error(err);
      else {
        console.log(`✅ Set members: ${reply.join(", ")}\n`);
      }
    });

    // Test 5: Increment counter
    console.log("Test 5: Counter with Increment");
    client.set("counter", "0", (err) => {
      if (err) console.error(err);
    });

    for (let i = 0; i < 5; i++) {
      client.incr("counter", (err, reply) => {
        if (err) console.error(err);
        else console.log(`✅ Counter incremented: ${reply}`);
      });
    }

    // Test 6: Key expiration
    console.log("\nTest 6: Key Expiration (TTL)");
    client.setex("tempkey", 60, "This will expire in 60 seconds", (err) => {
      if (err) console.error(err);
      else console.log("✅ Set key with 60 second expiration");
    });

    client.ttl("tempkey", (err, reply) => {
      if (err) console.error(err);
      else console.log(`✅ Key TTL: ${reply} seconds\n`);
    });

    // Test 7: Get stats
    setTimeout(() => {
      console.log("Test 7: Redis Server Info");
      client.info("memory", (err, reply) => {
        if (err) console.error(err);
        else {
          const lines = reply.split("\r\n");
          console.log("✅ Memory Statistics:");
          lines.forEach((line) => {
            if (line.includes("used_memory") || line.includes("max_memory")) {
              console.log(`   ${line}`);
            }
          });
        }
      });

      client.info("stats", (err, reply) => {
        if (err) console.error(err);
        else {
          console.log("\n✅ Server Statistics:");
          const lines = reply.split("\r\n");
          lines.forEach((line) => {
            if (
              line.includes("total_commands") ||
              line.includes("total_connections")
            ) {
              console.log(`   ${line}`);
            }
          });
        }
      });

      client.dbsize((err, reply) => {
        if (err) console.error(err);
        else console.log(`\n✅ Total keys in database: ${reply}\n`);
      });

      // Final cleanup
      setTimeout(() => {
        console.log("✅ All tests completed!");
        console.log("\n📱 Access Redis Commander at: http://localhost:8082\n");
        client.quit();
      }, 2000);
    }, 1000);
  } catch (error) {
    console.error("Test error:", error);
    client.quit();
  }
}
