// ENAPSO Enterprise Configuration Management
// (C) Copyright 2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze

const { DepartmentConfig } = require('./department_config');

class EnapsoConfigDemoConfig extends DepartmentConfig {
    constructor(data) {
        super(data);
        this.application = {
            name: 'ENAPSO\u26A1config - Configuration Demo',
            version: '1.0.0',
            copyrightFrom: '2020',
            copyrightTo: '2020'
        };

        this.packages['@myScope/myPackage'] = {
            dev: '/git/myPackage'
        };

        this.myDefaultConfig = {
            myDefaultSetting:
                'Configured value for myDefaultConfig.myDefaultSetting'
        };

        this.myModeConfig = {
            myModeSetting: 'String value for myDefaultConfig.myDefaultSetting',
            switch1: {
                $dev: 'switch1 in dev mode',
                $prod: 'switch1 in production mode',
                $default: 'switch1 in default mode'
            }
        };

        this.myAccessToken = this.getEnvVar(
            'MY_PERSONAL_ACCESS_TOKEN',
            '[MyPersonalAccessTokenNotSet]'
        );
    }
}

module.exports = {
    EnapsoConfigDemoConfig,
    config: EnapsoConfigDemoConfig
};
