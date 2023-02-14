const { Queue } = require('bullmq');
const fastify = require('fastify')({ logger: true })

const redisConfig = {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
}

// Create a new connection in every instance
const queue = new Queue('Cars', redisConfig, console.log("Successfully connected to redis!"));


const addJobsToQueue = async (type, message) => {
    await queue.add('paint', { type, message });
    // The job will now wait at least 5 seconds before it is processed.
    // await queue.add('paint', { type, message }, { delay });
    // The simplest option is to set removeOnComplete/Fail to "true", in this case, all jobs will be removed automatically as soon as they are finalized
    await queue.add('paint', { type, message }, { removeOnComplete: true, removeOnFail: true });
}

fastify.post('/send', (req, res) => {
    const type = req.body.type;
    const message = req.body.message;
    addJobsToQueue(type, message);
    res.status(200).send("Done!");
})

fastify.listen({ port: 5000 })

