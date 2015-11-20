var Backbone = require("backbone");
var Marionette = require("backbone.marionette");

var baseApiUrl = "http://dev.local:8111/api/v0";

var Torrent = Backbone.Model.extend(
{
	
});
var TorrentCollection = Backbone.Collection.extend(
{
	url: baseApiUrl + "/torrent"
});

var App = Marionette.Application.extend(
{
	initialize: function()
	{
		console.log("initializing");
	},
	onStart: function(options)
	{
		console.log("starting", options);

		var torrents = new TorrentCollection();
		torrents.fetch().done(function()
		{
			console.log(torrents);
		});
	}
});

var app = new App();

