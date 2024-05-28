const redis = require("redis")
const dotenv = require("dotenv")
dotenv.config()

const cacheHostName = process.env.REDIS_HOST;
const cachePassword = process.env.REDIS_PASSWORD;


async function testCache() {

    const cacheConnection = redis.createClient({
        url: `rediss://${cacheHostName}:6380`,
        password: cachePassword
    });

    await cacheConnection.connect();

    // PING command
    console.log("\nCache command: PING");
    console.log("Cache response : " + await cacheConnection.ping());

    // GET
    console.log("\nCache command: GET Message");
    console.log("Cache response : " + await cacheConnection.get("Message"));

    // SET
    console.log("\nCache command: SET Message");
    console.log("Cache response : " + await cacheConnection.set("Message",
        "Hello! The cache is working from Node.js!"));

    // GET again
    console.log("\nCache command: GET Message");
    console.log("Cache response : " + await cacheConnection.get("Message"));

    // Client list, useful to see if connection list is growing...
    console.log("\nCache command: CLIENT LIST");
    console.log("Cache response : " + await cacheConnection.sendCommand(["CLIENT", "LIST"]));

    // Disconnect
    cacheConnection.disconnect()

    return "Done"
}


async function setCaching (key, value, expireIn) {
    try{
        const cacheConnection = redis.createClient({
            url: `rediss://${cacheHostName}:6380`,
            password: cachePassword
        });
    
        await cacheConnection.connect();
    
        if(!!expireIn)
            await cacheConnection.set(key, value, {EX: expireIn})
        else
            await cacheConnection.set(key, value)
    
        cacheConnection.disconnect()
        return 0;
    } catch (ex) {
        return -1;
    }
}

async function getCaching (key) {
    try{
        const cacheConnection = redis.createClient({
            url: `rediss://${cacheHostName}:6380`,
            password: cachePassword
        });
    
        await cacheConnection.connect();
    
        let value = await cacheConnection.get(key)
        
        cacheConnection.disconnect()
        return value;
    } catch (ex) {
        return -1;
    }
}


module.exports = {testCache, setCaching, getCaching};
