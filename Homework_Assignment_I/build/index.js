'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var payloadString = void 0;

console.log(_path2.default.resolve('./https/key.pem'));
console.log(_path2.default.resolve('./https/cert.pem'));
var httpsOptions = {
    'key': _fs2.default.readFileSync(_path2.default.resolve('./https/key.pem')),
    'cert': _fs2.default.readFileSync(_path2.default.resolve('./https/cert.pem'))
};

var unifiedServer = function unifiedServer(req, res) {
    var parsedUrl = _url2.default.parse(req.url, true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var method = req.method.toUpperCase();
    var headers = req.headers;
    var routeHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    var data = {
        'trimmed_path': trimmedPath,
        'headers': headers,
        'method': method
    };
    routeHandler(data, function (statusCode, payload) {
        statusCode = typeof statusCode == 'number' ? statusCode : 200;
        payload = (typeof payload === 'undefined' ? 'undefined' : _typeof(payload)) == 'object' ? payload : {};
        payloadString = JSON.stringify(payload);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);
    });
};

var handlers = {
    hello: function hello(data, callback) {
        data.message = 'Welcome to the webpage';
        callback(200, data);
    },
    notFound: function notFound(data, callback) {
        data.message = 'Sorry, page not found';
        callback(404, data);
    }
};

var router = {
    hello: handlers.hello
};

var httpServer = _http2.default.createServer(function (req, res) {
    unifiedServer(req, res);
});

var httpsServer = _https2.default.createServer(httpsOptions, function (req, res) {
    unifiedServer(req, res);
});

httpServer.listen(_config2.default.httpPort, function () {
    console.log('Server listening on port ' + _config2.default.httpPort);
});

httpsServer.listen(_config2.default.httpsPort, function () {
    console.log('HTTPS server listening on port ' + _config2.default.httpsPort);
});
//# sourceMappingURL=index.js.map