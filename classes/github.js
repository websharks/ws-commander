(function()
{
	var retrieveRepoFromURL = function(url)
	{
		var regex = /^https?\:\/\/github\.com\/([^\/]+)\/([^\/]+)/i,
			matches, github = {owner: '', repo: ''};

		if(matches = url.match(regex))
			github.owner = matches[1], github.repo = matches[2];
		else return console.error('Invalid URL.');

		return github; // {owner: "websharks", repo: "test-repo"}
	};

	module.exports = function(args, flags)
	{
		if(!args.length > 1) return console.error('Not a valid use of `ws github`.');

		if(args[0] === 'next-issue-url' && args[1].length)
		{
			var repoInfo = retrieveRepoFromURL(args[1]);

			if(typeof repoInfo === undefined) return;

			module.exports.retrieveNextIssueID(repoInfo.owner, repoInfo.repo);
		}
		else return console.error('Not a valid use of `ws github`.');
	};

	module.exports.retrieveNextIssueID = function(owner, repo)
	{
		var https = require('https');

		var opts = {
			hostname: 'api.github.com',
			port    : 443,
			path    : '/repos/' + owner.toLowerCase() + '/' + repo.toLowerCase() + '/issues',
			method  : 'GET',
			headers : {
				'User-Agent': 'WebSharks Commander'
			}
		};

		var req = https.request(opts, function(res)
		{
			var body = '';

			res.setEncoding('utf8');
			res.on('data', function(chunk)
			{
				body += chunk.toString();
			});

			res.on('end', function()
			{
				var issues = JSON.parse(body);
				if(!issues.length || issues.hasOwnProperty('documentation_url')) return console.error('Error accessing GitHub API');

				var nextIssueNum = parseInt(issues[0].number) + 1;
				console.log('https://github.com/' + owner + '/' + repo + '/issues/' + nextIssueNum);
			});
		});

		req.end();
	};
})();