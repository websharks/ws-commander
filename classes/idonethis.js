(function()
{
	module.exports.todo = function(msg)
	{
		module.exports.done('[ ] ' + msg);
	};

	module.exports.done = function(msg)
	{
		var https = require('https'),
			querystring = require('querystring');

		if(!ws.config.hasOwnProperty('idonethis_api_key')) return console.error('No iDoneThis API Key set up. Please run `ws-install`.');

		var postData = querystring.stringify(
			{
				team     : 'websharks',
				raw_text : msg.trim(),
				meta_data: JSON.stringify({
					                          via: 'WebSharks Commander'
				                          })
			});

		var opts = {
			hostname: 'idonethis.com',
			port    : 443,
			path    : '/api/v0.1/dones/',
			method  : 'POST',
			headers : {
				'User-Agent'    : 'WebSharks Commander',
				'Authorization' : 'Token ' + ws.config.idonethis_api_key,
				'Content-Type'  : 'application/x-www-form-urlencoded',
				'Content-Length': postData.length
			}
		};

		var req = https.request(opts, function(res)
		{
			res.setEncoding('utf8');
			res.on('data', function(chunk){});

			res.on('end', function()
			{
				console.log('iDoneThis DONE: ' + msg);
			});
		});

		req.write(postData);
		req.end();
	};
})();