const { FastifyAdapter, createBullBoard, BullMQAdapter } = require('@bull-board/fastify');

function basicAuth(fastify, { queues }, next) {
    const basePath = '/bb/ui-' + Math.random().toString(36).slice(2);
    const serverAdapter = new FastifyAdapter();

    const queuesArray = queues.map(que => new BullMQAdapter(que));
    createBullBoard({
        queues: queuesArray,
        serverAdapter
    });

    serverAdapter.setBasePath(basePath);
    fastify.register(serverAdapter.registerPlugin(), { prefix: basePath });

    fastify.get("/bb/login", async (req, reply) => {
        const { user, key } = req.query;
        if (key !== '289JC1pau87fMjiWBBET' || user !== 'bb-admin') {
            return reply.status(403).send('Unauthorized!');
        }
        reply.redirect(basePath);
    });
    next();
}

module.exports = { basicAuth };