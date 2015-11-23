var Radio = require("backbone.radio");
var Marionette = require("backbone.marionette");
var TorrentCollection = require("../collections/torrent");
var Torrent = require("../models/torrent");
var TorrentCollectionView = require("../views/collections/torrent");

function Controller()
{
	var context = this;

	Radio.on("torrent", "add", context.add);

	var torrents = new TorrentCollection();

	Radio.reply("torrent", "collection", function()
	{
		return torrents;
	});
}

Controller.prototype.list = function()
{
	var torrents = Radio.request("torrent", "collection");
	var torrentsView = new TorrentCollectionView({ collection: torrents });

	torrents.fetch().done(function()
	{
		Radio.trigger("layout", "set", torrentsView);
	});

	console.log("list", "all");
};

Controller.prototype.delete = function(id)
{
	var torrents = Radio.request("torrent", "collection");
	var torrent = torrents.get(id);

	torrent.destroy(
	{
		contentType: "application/json",
		data: JSON.stringify({ delete_local_data: true })
	});

	console.log("torrent", "delete", id);
}

Controller.prototype.remove = function(id)
{
	var torrent = this.torrents.get(id);
	torrent.destroy();

	console.log("torrent", "remove", id);
};

Controller.prototype.resume = function(id)
{
	console.log("torrent", "resume", id);
};

Controller.prototype.add = function(magnet_uri)
{
	var torrents = Radio.request("torrent", "collection");
	var torrent = new Torrent({ magnet_uri: magnet_uri });
	torrent.save().done(function()
	{
		torrents.add(torrent);
		console.log(torrents);
		console.log("added!");
	});
	/*
	torrent.save().done(function()
	{
		torrents.add(torrent);
	});
	*/
};

new Marionette.AppRouter(
{
	controller: new Controller(),
	appRoutes: {
		"": "list",
		"torrent/:id/remove": "remove",
		"torrent/:id/resume": "resume",
		"torrent/:id/delete": "delete"
	}
});
