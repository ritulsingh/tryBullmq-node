const { Queue, Worker } = require('bullmq');

const ioredis = require('ioredis');
// We can also connect to redis using ioredis 
// const connection = new ioredis();
// Reuse the ioredis instance
// const myQueue = new Queue('myqueue', { connection }, console.log("Connected to redis!"));
// const myWorker = new Worker('myworker', async (job)=>{}, { connection }, console.log("Connected to redis!"));

// Create a new connection in every instance
const queue = new Queue('Cars', {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
}, console.log("Successfully connected to redis!"));

const addJobsToQueue = async (type, message, delay) => {
    await queue.add('paint', { type, message });

    // The job will now wait at least 5 seconds before it is processed.
    await queue.add('paint', { type, message }, { delay });

    // The simplest option is to set removeOnComplete/Fail to "true", in this case, all jobs will be removed automatically as soon as they are finalized
    await queue.add('paint', { type, message }, { removeOnComplete: true, removeOnFail: true });

    // Add jobs to the queue in bulk.
    // const jobs = await queue.addBulk([
    //     { name, data: { paint: 'car' } },
    //     { name, data: { paint: 'house' } },
    //     { name, data: { paint: 'boat' } },
    // ]);
}

addJobsToQueue("color", "Hello World!", 5000);
console.log("Done!");


const worker = new Worker('Cars', async (job) => {
    await job.updateProgress(42);

    // Optionally sending an object as progress
    await job.updateProgress({ color: 'red' });

    const { type, message } = job.data;
    console.log(`Message ${message} was sent to ${type}.`)

    // Do something with job
    return 'some value';
}, {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
});

worker.on('completed', (job) => {
    // Do something with the return value.
    console.log(job.id);
});

worker.on('failed', (job, err) => {
    console.error(`${job.id} has failed with ${err.message}`);
});
