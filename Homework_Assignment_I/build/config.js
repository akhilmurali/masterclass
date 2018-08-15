'use strict';

var productionConfig = {
    httpPort: 5000,
    httpsPort: 5001,
    env: 'prod'
};

var devConfig = {
    httpPort: 3000,
    httpsPort: 3001,
    env: 'dev'
};

module.exports = process.env.NODE_ENV == 'prod' ? productionConfig : devConfig;
//# sourceMappingURL=config.js.map