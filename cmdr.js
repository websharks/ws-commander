#!/usr/bin/env node
(function()
{
	// Allows usage of `window` variable instead of `GLOBAL` as needed.
	GLOBAL.window = GLOBAL;

	var fs = require('fs'),
		notify = require('osx-notifier'),
		readline = require('readline'),
		compressor = require('node-minify');

	var opts = {};

	if(fs.existsSync(__dirname + '/cmdr.json'))
		opts = require(__dirname + '/cmdr.json');

	if(!opts.user_name) console.error('No basic config found. Please run `ws-install` before trying to use this tool.');

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
			       type    : 'info',
			       title   : 'WS Commander',
			       subtitle: title,
			       message : msg,
			       group   : 'ws-commander'
		       });
	};

	ws.cwd = process.cwd();

	/* === Prep command arguments and flags ==== */

	var flags = [],
		command = false,
		args = [];

	process.argv.slice(2).forEach(
		function(val, index)
		{
			if(val.charAt(0) === '-') flags.push(val);
			else if(index === 0) command = val.trim();
			else args.push(val);
		}
	);

	/* === Determine command === */

	if(command === 'min' || command === 'minify')
	{
		if(!args.length) console.error('No arguments specified for minification.');

		var compressJS = function(path)
		{
			new compressor.minify(
				{
					type    : 'gcc', // Google Closure
					fileIn  : path,
					fileOut : path.replace(/\.js$/, '.min.js'),
					callback: function(err, min)
					{
						if(err) console.error('Error minifying file `' + path + '`: ' + "\n" + err);
						console.log(path + ' has been minified.');
					}
				}
			);
		};

		var compressCSS = function(path)
		{
			new compressor.minify(
				{
					type    : 'yui-css', // YUI
					fileIn  : path,
					fileOut : path.replace(/\.css/, '.min.css'),
					callback: function(err, min)
					{
						if(err) console.error('Error minifying file `' + path + '`: ' + "\n" + err);
						console.log(path + ' has been minified.');
					}
				}
			);
		};

		args.forEach(
			function(fd)
			{
				var path;

				if(fd.charAt(0) === '/') path = fd;
				else path = ws.cwd + '/' + fd;

				if(!fs.existsSync(path)) return console.log('Skipping `' + path + '`. Path not found.');

				var stat = fs.statSync(path);

				// Single files
				if(stat.isFile())
				{
					// Minify JS
					if(path.match(/\.js$/))
						compressJS(path);

					// Minify CSS
					else if(path.match(/\.css$/))
						compressCSS(path);
				}

				// Directories
				else if(stat.isDirectory())
				{
					var exec = require('child_process').exec;
					exec('find ' + path + ' | grep \'\.css$\'', function(err, stdout, stderr)
					{
						var file_list = stdout.split('\n');

						file_list.forEach(function(val, index)
						                  {
							                  if(val.length && !val.match(/\.min\.css$/)) compressCSS(val);
						                  });
					});

					exec('find ' + path + ' | grep \'\.js$\'', function(err, stdout, stderr)
					{
						var file_list = stdout.split('\n');

						file_list.forEach(function(val, index)
						                  {
							                  if(val.length && !val.match(/\.min\.js$/)) compressJS(val);
						                  });
					});
				}
			}
		);
	}
	else
		console.error('No valid command specified. See `man ws` for details on usage.');
})();