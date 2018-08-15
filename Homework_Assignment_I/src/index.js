import http from 'http';
import url from 'url';
import https from 'https';
import config from './config';
import fs from 'fs';
import path from 'path';

let payloadString;

let httpsOptions = {
    'key' : fs.readFileSync(path.resolve('./https/key.pem')),
    'cert': fs.readFileSync(path.resolve('./https/cert.pem'))
}


let unifiedServer = (req, res) => {
    let parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');
    let method = req.method.toUpperCase();
    let headers = req.headers;
    var routeHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    let data = {
        'trimmed_path': trimmedPath,
        'headers': headers,
        'method': method,
    }
    routeHandler(data, (statusCode, payload) => {
        statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
        payload = typeof (payload) == 'object' ? payload : {};
        payloadString = JSON.stringify(payload);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
    });
}

let handlers = {
    hello: (data, callback) => {
        data.message = 'Welcome to the webpage';
        callback(200, data);
    },
    notFound: (data, callback) => {
        data.message = 'Sorry, page not found';
        callback(404, data);
    }
};

let router = {
    hello: handlers.hello
};

let httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

let httpsServer = https.createServer(httpsOptions, (req, res) => {
    unifiedServer(req, res);
});

httpServer.listen(config.httpPort, () => {
    console.log('HTTP Server listening on port ' + config.httpPort);
});

httpsServer.listen(config.httpsPort, () => {
    console.log('HTTPS server listening on port ' + config.httpsPort);
});
