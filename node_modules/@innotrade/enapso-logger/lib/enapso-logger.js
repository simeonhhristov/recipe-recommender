// Innotrade Enapso Logger
// (C) Copyright 2019-2020 Innotrade GmbH, Herzogenrath, NRW, Germany
// Author: Alexander Schulze

// a new console object for enhanced logging to the console

const { EnapsoArgs, enargs } = require("@innotrade/enapso-args");

class EnapsoLogger {

	static get MIN_LEVEL() { return 0; }
	static get MAX_LEVEL() { return 6; }

	static get DEF_PRF_LEN() { return 4; }
	static get DEF_SEP_LEN() { return 80; }
	static get DEF_SEP_CHAR() { return '-'; }

	static get ALL() { return 0; }
	static get DEBUG() { return 1; }
	static get INFO() { return 2; }
	static get WARN() { return 3; }
	static get ERROR() { return 4; }
	static get FATAL() { return 5; }
	static get NONE() { return 6; }

	static get LEVELS() {
		return [
			'ALL',
			'DEBUG',
			'INFO',
			'WARN',
			'ERROR',
			'FATAL',
			'NONE'
		]
	}

	constructor() {
		this.level = 2;
		this.active = true;
		// this.layout = '[$l] $t $m';
		this.layout = '$m';

		this.console = {};
		this.console.log = console.log;
		this.console.debug = console.debug ? console.debug : this.console.log;
		this.console.info = console.info ? console.info : this.console.log;
		this.console.warn = console.warn ? console.warn : this.console.log;
		this.console.error = console.error ? console.error : this.console.log;
		this.console.fatal = console.fatal ? console.fatal : this.console.error;
	}

	setLevel(level) {
		if (level !== undefined
			&& (level !== null)
			&& (typeof level === 'number')
			&& (level >= EnapsoLogger.MIN_LEVEL)
			&& (level <= EnapsoLogger.MAX_LEVEL)) {
			this.level = level;
		} else {
			throw new Error('Tools.console.setLevel:'
				+ ' Invalid level!');
		}
	}

	setLayout(layout) {
		if (layout && typeof layout === 'string') {
			this.layout = layout;
		} else {
			throw new Error('Tools.console.setLayout:'
				+ ' Invalid layout, needs to be a string!');
		}
	}

	replaceVars(level, message) {
		if (message === undefined
			|| message === null
			|| typeof message !== 'string') {
			message = '';
		}
		var lMsg = this.layout;
		lMsg = lMsg
			.replace('$m', message)
			.replace('$l', EnapsoLogger.LEVELS[level])
			.replace('$t', new Date().toISOString());
		return lMsg;
	}

	setActive(active) {
		this.active = active;
	}

	separatorLine(aIn, options) {
		if (!aIn) {
			aIn = '';
		}
		options = {  // Tools.checkArgs(options, {
			char: EnapsoLogger.DEF_SEP_CHAR,
			length: EnapsoLogger.DEF_SEP_LEN,
			prefix: EnapsoLogger.DEF_PRF_LEN
		};
		if (EnapsoLogger.DEF_PRF_LEN > 0) {
			aIn = ' ' + aIn;
		}
		for (var lCnt = 0; lCnt < EnapsoLogger.DEF_PRF_LEN; lCnt++) {
			aIn = options.char + aIn;
		}
		aIn += ' ';
		while (aIn.length < options.length) {
			aIn += options.char;
		}
		return aIn;
	}

	log(message) {
		if (message && this.active) {
			arguments[0] = this.replaceVars(EnapsoLogger.DEBUG, arguments[0]);
			this.console.log.apply(this, arguments);
		}
	}

	debug(message) {
		if (message && this.active && this.level <= EnapsoLogger.DEBUG) {
			arguments[0] = this.replaceVars(EnapsoLogger.DEBUG, arguments[0]);
			this.console.debug.apply(this, arguments);
		}
	}

	info(message) {
		if (message && this.active && this.level <= EnapsoLogger.INFO) {
			arguments[0] = this.replaceVars(EnapsoLogger.INFO, arguments[0]);
			this.console.info.apply(this, arguments);
		}
	}

	warn(message) {
		if (message && this.active && this.level <= EnapsoLogger.WARN) {
			arguments[0] = this.replaceVars(EnapsoLogger.WARN, arguments[0]);
			this.console.warn.apply(this, arguments);
		}
	}

	error(message) {
		if (message && this.active && this.level <= EnapsoLogger.ERROR) {
			arguments[0] = this.replaceVars(EnapsoLogger.ERROR, arguments[0]);
			this.console.error.apply(this, arguments);
		}
	}

	fatal(message) {
		if (message && this.active && this.level <= EnapsoLogger.FATAL) {
			arguments[0] = this.replaceVars(EnapsoLogger.FATAL, arguments[0]);
			this.console.fatal.apply(this, arguments);
		}
	}

}

class EnapsoLoggerFactory {

	static logger = {};

	static getLogger(alias) {
		alias = alias || '$default';
		let logger = this.logger[alias];
		if (logger) return logger;
		logger = new EnapsoLogger();
		this.logger[alias] = logger;
		return logger;
	}

	static createGlobalLogger(alias) {
		if (!alias) {
			throw "No alias for global logger!";
		}
		let logger = global[alias];
		if (logger) return logger;
		logger = new EnapsoLogger();
		global[alias] = logger;
		return logger;
	}

}

const enLoggerFactory = new EnapsoLoggerFactory();

module.exports = {
	// without name space
	EnapsoLogger, EnapsoLoggerFactory,
	// with namespace
	enlogger: {
		EnapsoLogger, EnapsoLoggerFactory
	}
}