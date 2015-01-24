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

			console.log(repoInfo);
		}
		else return console.error('Not a valid use of `ws github`.');
	};
})();