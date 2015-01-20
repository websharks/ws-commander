#!/usr/bin/env node
(function()
{
	// Allows usage of `window` variable instead of `GLOBAL` as needed.
	GLOBAL.window = GLOBAL;

	var fs = require('fs'),
		notify = require('osx-notifier'),
		readline = require('readline');

	var opts = {};

	if(fs.existsSync(__dirname + '/cmdr.json'))
		opts = require(__dirname + '/cmdr.json');

	if(!opts.user_name) console.error('No basic config found. Please run `npm setup` from the `ws-commander` installation directory before trying to use this tool.');

	/* === Done Basic Setup === */

	/* === Global Utilities Setup === */
	GLOBAL.ws = {};

	/**
	 * Creates a desktop notification (for OSX only)
	 *
	 * @param title string
	 * @param msg string
	 *
	 * Usage: `ws.notify('Test Subject / Title', 'Message to display in Notification');`
	 */
	ws.notify = function(title, msg)
	{
		notify({
			       type      : "info",
			       "title"   : "WS Commander",
			       "subtitle": title,
			       "message" : msg,
			       "group"   : "ws-commander"
		       });
	};

	/* === Etc. ==== */
})();