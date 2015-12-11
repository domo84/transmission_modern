var Backbone = require("backbone");
var settings = require("../../json/settings");

var statuses = [
	"Stopped",		// 0: Torrent is stopped
	"Queued",		// 1: Queued to check files
	"Checking",		// 2: Checking files
	"Queued",		// 3: Queued to download
	"Downloading",	// 4: Downloading
	"Queued",		// 5: Queued to seed
	"Seeding"		// 6: Seeding
];

module.exports = Backbone.Model.extend(
{
	urlRoot: settings.api_url + "/torrent",
	parse: function(result, options)
	{
		if(false === true && result.error)
		{
			result.statusText = "Error";
		}
		else
		{
			result.statusText = statuses[result.status];
		}

		return result;
	},
	purge: function()
	{
		this.destroy(
		{
			contentType: "application/json",
			data: JSON.stringify({ delete_local_data: true })
		});
	},
	stop: function()
	{
		this.save(
		{
			method: "torrent-stop"
		},
		{
			patch: true
		}).done(() => this.collection.redraw());
	},
	start: function()
	{
		this.save(
		{
			method: "torrent-start",
			x_isFinished: this.get("downloadedEver") > this.get("totalSize") 
		},
		{
			patch: true
		}).done(() => this.collection.redraw());
	}
});
