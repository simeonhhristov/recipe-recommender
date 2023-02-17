# Enapso Logger

Enapso Logger is a logging tool for node.js applications.

Enapso Logger...
* formats your log output according to templates
* filters your log output to arbitrary levels
* can be activated and deactivated at run-time

## Installation
```
npm i @innotrade/enapso-logger --save
```

## Migration
First off all, the migration effort is as low as a simple search of ```console.[log|debug|infi|warn|error]``` and replace it by ```enlogger.[log|debug|infi|warn|error]``` - and your code will keep running without a visual difference. The Enapso Logger uses the Enapso Smart Arguments Processor to interpret optional parameters or alternative parameter types so that you can improve the logging capabilities in your code step by step as needed following the documentation below.

## Usage
```javascript
const { EnapsoLogger } = require('@innotrade/enapso-logger');
global.enlogger = new EnapsoLogger();

function demo() {
	enlogger.setLevel(EnapsoLogger.ALL);

	enlogger.log("This is a standard log line, just for compatibility reasons");
	enlogger.debug("This is a debug message");
	enlogger.info("This is an information");
	enlogger.warn("This is a warning");
	enlogger.error("This is an error message");
	enlogger.fatal("This is a fatal message");

	enlogger.info(enlogger.separatorLine());
	enlogger.setActive(false);
	enlogger.info("This message will NOT be shown");
	enlogger.setActive(true);
	enlogger.info("This message will be shown again");
}

demo();
```

The ```log``` method was implemented for pure compatibility reasons.
This method suppresses when the logger is disabled, but it does not consider the configured log-level.
So it is strongly recommended to use the qualified log methods ```debug```, ```info```, ```warn```, ```error``` and ```fatal```.