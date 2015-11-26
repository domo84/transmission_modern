var Backbone = require("backbone");
var settings = require("../../json/settings");

var statuses = [
	"Stopped",		// Torrent is stopped
	"Queued",		// Queued to check files
	"Checking",		// Checking files
	"Queued",		// Queued to download
	"Downloading",	// Downloading
	"Queued",		// Queued to seed
	"Seeding"		// Seeding
]

module.exports = Backbone.Model.extend(
{
	urlRoot: settings.api_url + "/torrent",
	parse: function(result)
	{
		result.statusText = statuses[result.status];

		return result;
	}

	/* LEGACY 
	url: function()
	{
		var base = settings.api_url + "/torrent";

		if (this.isNew())
		{
			return base;
		}

		return base + "/" + this.id;
	}
	*/
});
