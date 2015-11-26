var Radio = require("backbone.radio");
var Marionette = require("backbone.marionette");
var TorrentCollection = require("../collections/torrent");
var Torrent = require("../models/torrent");
var TorrentCollectionView = require("../views/collections/torrent");

function Controller()
{
	var context = this;

	Radio.on("torrent", "add", function(torrent)
	{
		context.add(torrent);
		console.log("Radio", "Torrent", "Add");
	});

	context.torrents = new TorrentCollection();
}

Controller.prototype.list = function()
{
	var torrents = this.torrents
	var torrentsView = new TorrentCollectionView({ collection: torrents });

	torrents.fetch().done(function()
	{
		Radio.trigger("layout", "set", torrentsView);
	});

	console.log("list", "all");
};

Controller.prototype.delete = function(id)
{
	var torrent = this.torrents.get(id);

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

Controller.prototype.add = function(magnet_uri_1, magnet_uri_2)
{
	var torrents = this.torrents;
	var torrent = new Torrent({ magnet_uri: magnet_uri_1 + "?" + magnet_uri_2 });
	torrent.save().done(function()
	{
		console.log(torrent);
		console.log("added!");
		torrents.add(torrent);
	});
};

new Marionette.AppRouter(
{
	controller: new Controller(),
	appRoutes: {
		"": "list",
		"torrent/:id/remove": "remove",
		"torrent/:id/resume": "resume",
		"torrent/:id/delete": "delete",
		"torrent/add/*magnet_uri": "add"
	}
});
