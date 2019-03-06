const path = require('path');
const express = require('express');
const next = require('next');
const LRU = require('lru-cache');

const app = next({dev: process.env.NODE_ENV !== 'production'});
const handle = app.getRequestHandler();

require('mobx-react').useStaticRendering(true);

const cache = new LRU({max: 20, maxAge: 60000 * 5});

const render = async (req, res, url) => {
    const key = req.url;

    if (cache.has(key)) {
        res.setHeader('x-cache', 'HIT');
        return res.send(cache.get(key));
    }

    try {
        const html = await app.renderToHTML(req, res, url);
        if (res.statusCode !== 200) return res.send(html);
        cache.set(key, html);
        res.setHeader('x-cache', 'MISS');
        res.send(html);
    } catch (err) {
        app.renderError(err, req, res, url);
    }
};

(async () => {
    await app.prepare();

    const server = express();

    server.get('/', (req, res) => render(req, res, '/'));

    server.get('/service-worker.js', (req, res) =>
        app.serveStatic(req, res, path.resolve(__dirname, './.next/service-worker.js'))
    );

    server.use('/static', express.static(path.resolve(__dirname, './.next/static')));

    server.get('*', (req, res) => handle(req, res));

    const port = await new Promise((resolve, reject) =>
        server.listen(Number(process.env.PORT) || 3000, function(err) {
            if (err) return reject(err);
            resolve(this.address().port);
        })
    );

    console.log(`> Live @ https://localhost:${port}`);
})().catch(err => console.error(err));
