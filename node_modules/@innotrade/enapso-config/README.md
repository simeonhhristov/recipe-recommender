# ENAPSO&#x26A1;config - Enterprise Configuration Management

## Intention

ENAPSO Config helps you easily manage your application configuration in enterprise environments.

It enables you to ...

-   hierachically organize your configuration data to inherit company or department settings down to user or specific machine level
-   easily switch between development, stage or production settings, further environments configurable
-   use defaults and optionally expose information logs in case default settings instead of explicit ones are returned
-   expose warnings or errors in case an application setting is missing
-   easily use and maintain local node.js packages without the need to embed them as submodules or even deploy them to npm
-   calculate compound configuration settings based on single or other compound settings
-   version control your configuration data opposed to environment variables, according to the version specific configuration requirements of your application
-   easily track missing configurations in your specific configuration file
-   securly use sensitive information in environment variables like passwords or api keys in a shared configuration environment and benefit from optional defaults and notifications

## Installation

Just import the `@innotrade/enapso-config` package as follows:

```
npm i @innotrade/enapso-config --save
```

## Usage

Just require the `@innotrade/enapso-config` package as follows:

```javascript
require('@innotrade/enapso-config');
```

### .env file

The `.env` file in the project's root folder just requires a single reference to the configuration file in the form:

```
ENAPSO_CONFIG_FILE = [path_to_config_file]
```

You can either specify an absolute path to your configuration file:

```
ENAPSO_CONFIG_FILE=/System/Volumes/Data/git/enapso-config/config/enapso-config-demo.js
```

Alternatively you can specify the path using the `${AppRoot}` variable:

```
ENAPSO_CONFIG_FILE=${AppRoot}/config/enapso-config-demo.js
```

### Setting up the enterprise configuration

#### General

```
ENAPSO_CONFIG_FILE = ${AppRoot}/config/[app]-[user]-[system].js
```

#### Example

```
ENAPSO_CONFIG_FILE = ${AppRoot}/config/CompanyApp-AlexanderSchulze-MacBookHomeOffice.js
```

and use it where ever you need, with fields or as entire object:

```javascript
console.log(encfg.getApplicationString());
console.log(encfg.getCopyrightString());

const instance = new mynamespace.MyClass(
    {
        appName: config.generator.appName,
        modelName: 'hardcoded'
    },
    config
);
```

## Class Inheritance

Especially in enterprise environments, ENAPSO Config simplifies your application configuration management by inheriting common settings from higher levels like company or department level down to user or machine level. Settings on company or department level only need to be declared once and not on each and every user's machine(s). New settings in common levels are automatically shared with each user, changes in common configurations are applied to local environments if not yet explicitly specified. This massively reduces maintenance efforts and potential issues in your application due to missing configuration settings.

Out of the box, we provide three levels of configuration: Company, Department and User/Machine. Of course, you can easily extend that e.g. by introducing a new BusinessUnit level and even separating the user from the machine configuration in case users develop on multiple machines. In more simple enviroment, you also can reduce the levels by e.g. limiting the structure to just contain company and application level. ENAPSO Config can easily be used according to you specific environment and use cases.

```
EnapsoConfig
+-- RootConfig
    +-- CompanyConfig
        +-- DepartmentConfig
            +-- User/MachineConfig
```

### EnapsoConfig

The EnapsoConfig class contains the methods to load, access and maintain configuration. This is ENAPSO Config internal and you usually you do not put any configuration data inside this class or maintain it manually.

### RootConfig

The RootConfig class is intended to contain abstract or rudimentary default configuration on vendor or platform level. Usually, here you do usually not maintain any configuration related to company business unit, department, developer or machine level.

### CompanyConfig

In this class you configure your configuration settings across the entire company. For instance, this includes your company name and address, contact data and your homepage, your legal and social media information.

### BusinessUnitConfig (optional)

In the out-of-the-box package of ENAPSO the DepartmentConfig class is a direct descendant from CompanyConfig. In case your enterprise structure requires a differentation by business unit you can easily introduce such. Just provide a new BusinessUnitConfig class following the same pattern like the company configuration class, extend that class from CompanyConfig and extend the DepartmentConfig from the new BusinessUnitConfig class instead of CompanyConfig.

```
EnapsoConfig
+-- RootConfig
    +-- CompanyConfig
        +-- BusinessUnitConfig
            +-- DepartmentConfig
                +-- User/MachineConfig
```

### DepartmentConfig

### User/MachineConfig (combined)

In the user configuration you usually add your username, e.g. for automated authentication. Please be aware that passwords, api keys or other sensitve data never should be maintained in configuration files that are shared with others, e.g. in source control repositories like git. If you want to manage credentials in your configuration you can easily set their values by using a reference to process.env.VARIABLE instead of hard coding them in the source code.

```
EnapsoConfig
+-- RootConfig
    +-- CompanyConfig
        +-- DepartmentConfig
            +-- User
                +-- MachineConfig
```

## Sensitive data

Do not hard code sensitive data directly in the configuration file but reference to a environment variable.

```javascript
class EnapsoConfigDemoConfig extends DepartmentConfig {
    constructor(data) {
        super(data);
        :
        this.myAccessToken = process.env.MY_PERSONAL_ACCESS_TOKEN;
    }
}
```

Doing so, enables you to read the sensitive value from the configuration in the same like they were hard coded:

```javascript
// accessing sensitive data from environment variables
const myAccessToken = encfg.getConfig(
    'myAccessToken',
    '[no access token configured]'
);
console.log('Accessing sensitive data from env variables: ' + myAccessToken);
```

### Notifications

In case the environment variable is not set, as a developer, you will not get any notification.
If you want to get notified, you can wrap the reference by a call to `this.getEnvVar` like this:

```javascript
this.myAccessToken = this.getEnvVar(process.env.MY_PERSONAL_ACCESS_TOKEN);
```
