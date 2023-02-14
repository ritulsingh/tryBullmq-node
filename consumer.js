const { Worker } = require('bullmq');

const redisConfig = {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
}

function consumer(job) {
    const { type, message } = job.data;
    console.log(`Message: ${message} and Type: ${type}.`)
}

const worker = new Worker('Cars', consumer, redisConfig, console.log("Worker started"));

worker.on('completed', (job) => {
    // Do something with the return value.
    console.log(`${job.id} has been completed`);
});
worker.on('failed', (job, err) => {
    console.error(`${job.id} has failed with ${err.message}`);
});



