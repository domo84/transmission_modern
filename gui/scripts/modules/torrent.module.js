var Radio = require("backbone.radio");
var Marionette = require("backbone.marionette");
var TorrentCollection = require("../collections/torrent");
var Torrent = require("../models/torrent");
var TorrentCompositeView = require("../views/composite/torrent");
var AddView = require("../views/items/add");

function Controller()
{
	var context = this;
	var channel = Radio.channel("torrent");

	channel.on("delete", function(id)
	{
		context.delete(id);
	});

	channel.on("resume", function(id)
	{
		context.reumse(id);
	});

	channel.on("remove", function(id)
	{
		context.remove(id);
	});

	channel.on("add", function(torrent)
	{
		context.add(torrent);
		console.log("Radio", "Torrent", "Add");
	});

	context.torrents = new TorrentCollection();
}

Controller.prototype.list = function()
{
	var torrents = this.torrents
	var torrentsView = new TorrentCompositeView({ collection: torrents });

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

Controller.prototype.add = function()
{
	var context = this;

	var view = new AddView();

	Radio.trigger("layout", "set", view);

	view.on("add", function(uri)
	{
		var torrent = new Torrent({ uri: uri });
		torrent.save();
	});

	console.log("torrent", "add");
};

new Marionette.AppRouter(
{
	controller: new Controller(),
	appRoutes: {
		"": "list",
		"torrent/:id/remove": "remove",
		"torrent/:id/resume": "resume",
		"torrent/:id/delete": "delete",
		"torrent/add": "add"
	}
});
