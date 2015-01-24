(function()
{
	var fs = require('fs'),
		compressor = require('node-minify');

	exports.compress = function(args, flags)
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
	};
})();