// ENAPSO Enterprise Configuration Management
// (C) Copyright 2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze

// load ENAPSO config
require('../index.js');

// ENAPSO config ensures that level is only one of 'log', 'info', 'warn' or 'error'
encfg.setCallback(function (level, message) {
    console[level](level + ': ' + message);
});

// after ENAPSO config is loaded, requireEx is available
requireEx('@InvalidScope/InvalidPackage');
requireEx('@myScope/myPackage');

// use two default configuration methods
console.log(encfg.getApplicationString());
console.log(encfg.getCopyrightString('2020', '2020'));

console.log(
    'Reading myDefaultConfig.myDefaultSetting: ' +
        encfg.get('myDefaultConfig.myDefaultSetting', 'myDefaultValue')
);
console.log(
    'Reading myDefaultConfig.myDefaultSetting2: ' +
        encfg.get(
            'myDefaultConfig.myDefaultSetting2',
            'Resulting in myDefaultValue2'
        )
);

// accessing sensitive data from environment variables
const myAccessToken = encfg.getConfig(
    'myAccessToken',
    '[no access token configured]'
);
console.log('Accessing sensitive data from env variables: ' + myAccessToken);

// switching between different modes
let val;

// switching to development mode
encfg.setMode(encfg.MODE_DEV);
val = encfg.get('myModeConfig.switch1', 'Resulting in defaultValue');
console.log('(mode: ' + encfg.getMode() + '): ' + val);

// switching to production mode
encfg.setMode(encfg.MODE_PROD);
val = encfg.get('myModeConfig.switch1', 'Resulting in defaultValue');
console.log('(mode: ' + encfg.getMode() + '): ' + val);

// switching to default mode
encfg.setMode(encfg.MODE_DEFAULT);
val = encfg.get('myModeConfig.switch1', 'Resulting in defaultValue');
console.log('(mode: ' + encfg.getMode() + '): ' + val);
