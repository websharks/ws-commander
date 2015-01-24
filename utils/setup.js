#!/usr/bin/env node
(function()
{
	var opts = {}; // Options object

	var fs = require('fs'),
		notify = require('osx-notifier'),
		readline = require('readline');

	var rl = readline.createInterface({input: process.stdin, output: process.stdout}),
		homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

	/* === Initial Build Information === */

	console.log("\n" + 'This script will take you through account setup for various portions of the WebSharks Commander.');

	/**
	 * Prompt for initial "Name" argument
	 */
	rl.question('To begin with, what should I call you?: ', function(name)
	{
		opts.user_name = name;
		console.log('Thank-you, ' + name + '. I\'ll call you that from now on.');

		gitHubPrompt();
	});

	/**
	 * Prompt for GitHub integration details
	 */
	var gitHubPrompt = function()
	{
		rl.question('Would you like to set up the GitHub integration? [y/N]: ', function(doGitHub)
		{
			doGitHub = doGitHub.toLowerCase().charAt(0) === 'y';

			if(doGitHub)
			{
				console.log('Okay, let\'s set up GitHub.');

				rl.question('GitHub Personal Access API Key: ', function(key)
				{
					opts.github_api_key = key.trim();
					finish();
				});
			}
			else
			{
				console.log('Okay, moving on.');
				finish();
			}
		});
	};

	/**
	 * Wraps everything up
	 */
	var finish = function()
	{
		rl.close(); // Stops execution after function ends.

		var json = JSON.stringify(opts);
		fs.writeFileSync(homeDir + '/.cmdr.json', json);

		console.log("\n" + 'That\'s it! Thanks for setting up the WebSharks Commander! Your settings have been saved.');
		notify({
			       type      : "info",
			       "title"   : "WS Commander",
			       "subtitle": "Setup Complete",
			       "message" : "You have successfully set up the WebSharks Commander.",
			       "group"   : "ws-commander"
		       });
	}
})();