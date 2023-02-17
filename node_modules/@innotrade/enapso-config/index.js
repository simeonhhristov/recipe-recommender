// ENAPSO Enterprise Configuration Management
// (C) Copyright 2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze

// to use local .env file
require('dotenv').config();

const { EnapsoConfig } = require('./config/enapso_config.js');
const { RootConfig } = require('./config/root_config.js');
process.env.ENAPSO_CONFIG_FILE =
    process.env.ENAPSO_CONFIG_FILE || './config/root_config.js';

let encfg = {
    EnapsoConfig,
    RootConfig
};

// if no global object set yet, define it
if (!global.encfg) {
    global.encfg = encfg;
    encfg.config = {};
    encfg.notify = EnapsoConfig.notify;
    encfg.MODE_DEV = EnapsoConfig.MODE_DEV;
    encfg.MODE_PROD = EnapsoConfig.MODE_PROD;
    encfg.MODE_STAGE = EnapsoConfig.MODE_STAGE;
    encfg.MODE_DEFAULT = EnapsoConfig.MODE_DEFAULT;
}

// load the configuration from the user, application or machine specific config file
const path = process.env.ENAPSO_CONFIG_FILE.replace(
    '${AppRoot}',
    __dirname
).replace('${EnapsoConfigBase}', process.env.ENAPSO_CONFIG_BASE);
const configClass = require(path);
const config = new configClass.config();

// set the configuration mode
process.env.ENAPSO_CONFIG_MODE = process.env.ENAPSO_CONFIG_MODE || 'default';
config.setMode(process.env.ENAPSO_CONFIG_MODE);

encfg.config = config;
encfg.packages = config.packages;

function getAllProperties(obj) {
    var props = Object.keys(obj);
    do {
        props = props.concat(Object.getOwnPropertyNames(obj));
    } while ((obj = Object.getPrototypeOf(obj)));

    return props.sort().filter(function (item, idx, arr) {
        return (
            item != arr[idx + 1] && !item.startsWith('__')
            /* && typeof toCheck[e] == 'function' */
        );
    });
}

var keys = getAllProperties(config);
for (const key of keys) {
    encfg[key] = config[key];
}

// publish requireEx to global scope for convenience
global.requireEx = function (pkgRef) {
    return config.requireEx(pkgRef);
};

// and export the loaded configuration object
module.exports = {
    config,
    EnapsoConfig,
    RootConfig
};
