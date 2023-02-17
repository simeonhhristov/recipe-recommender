// Innotrade Enapso Logger
// (C) Copyright 2019-2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze

// a new console object for enhanced logging to the console

const { EnapsoLogger, EnapsoLoggerFactory } = require('../index');
EnapsoLoggerFactory.createGlobalLogger('enLogger');
enLogger.setLevel(EnapsoLogger.ALL);

function demo() {
	enLogger.setLevel(EnapsoLogger.ALL);

	enLogger.log('This is a standard log line, just for compatibility reasons');
	enLogger.debug('This is a debug message');
	enLogger.info('This is an information');
	enLogger.warn('This is a warning');
	enLogger.error('This is an error message');
	enLogger.fatal('This is a fatal message');

	enLogger.info(enLogger.separatorLine());
	enLogger.setActive(false);
	enLogger.info('This message will NOT be shown');
	enLogger.setActive(true);
	enLogger.info('This message will be shown again');
}

demo();
