const fastify = require('fastify')({ logger: true })
const { Queue } = require("bullmq");
const { basicAuth } = require("./bullmq-dashboard/bullmq-ui");

const redisConfig = {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
}

// Create a new connection in every instance
const queue = new Queue('Cars', redisConfig);
const queueTwo = new Queue('queueTwo', redisConfig);
const queueThree = new Queue('queueThree', redisConfig);
const queueFour = new Queue('queueFour', redisConfig);
const queueFive = new Queue('queueFive', redisConfig);

fastify.register(basicAuth, {
    queues: [
       queue,
       queueTwo,
       queueThree,
       queueFour,
       queueFive
    ]
});


const addJobsToQueue = async (type, message) => {
    await queue.add('paint', { type, message });
    await queueTwo.add('queueTwo', { type, message }, { removeOnComplete: true, removeOnFail: true });
    await queueThree.add('queueThree', { type, message }, { removeOnComplete: true, removeOnFail: true });
    await queueFour.add('queueFour', { type, message }, { removeOnComplete: true, removeOnFail: true });
    await queueFive.add('queueFive', { type, message });
    
}

fastify.post('/send', (req, res) => {
    const type = req.body.type;
    const message = req.body.message;
    addJobsToQueue(type, message);
    res.status(200).send("Done!");
})

fastify.listen({ port: 5000 })

