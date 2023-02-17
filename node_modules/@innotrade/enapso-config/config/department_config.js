// ENAPSO Enterprise Configuration Management
// (C) Copyright 2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze

// here only configurations across an entire department are implemented

const { CompanyConfig } = require('./company_config');
var path = require('path');

class DepartmentConfig extends CompanyConfig {
    constructor(data) {
        super(data);
        this.company.department = 'Software & IT Consulting';

        this.packages = {
            '@innotrade/enapso-graphdb-client': {
                dev: path.normalize(
                    module.path + '/../../enapso-graphdb-client'
                )
            },
            '@innotrade/enapso-graphdb-admin': {
                dev: path.normalize(module.path + '/../../enapso-graphdb-admin')
            }
        };
    }
}

module.exports = {
    DepartmentConfig,
    config: DepartmentConfig
};
