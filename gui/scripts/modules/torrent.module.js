var $ = require("jquery");
var Backbone = require("backbone");
var Radio = require("backbone.radio");
var Marionette = require("backbone.marionette");
var TorrentCollection = require("scripts/collections/torrent");
var Torrent = require("scripts/models/torrent");
var TorrentCompositeView = require("scripts/views/composite/torrent");
var TorrentShowView = require("scripts/views/items/torrent_detail");
var AddView = require("scripts/views/items/add");
var Layout = require("scripts/views/layouts/torrent");
var Poller = require("scripts/utils/poller");

function Controller()
{
}

Controller.prototype.list = function()
{
	console.log("list", "all");

	var context = this;
	var torrents = new TorrentCollection();
	var poller = new Poller(torrents);
	var view = new TorrentCompositeView({ collection: torrents });
	var layout = new Layout();

	layout.main.show(view);

	view.on("destroy", () => poller.stop());

	$(window).blur(() => poller.stop());
	$(window).focus(() => poller.start());

	poller.on("tick", () => view.render());
	poller.start();
};

Controller.prototype.show = function(id)
{
	console.log("torrent", "show", id);

	var context = this;
	var torrent = new Torrent({ id : id });

	torrent.fetch().done(function()
	{
		var layout = new Layout();
		var view = new TorrentShowView({ model: torrent });

		layout.main.show(view);
	});
};

Controller.prototype.add = function()
{
	console.log("torrent", "add");

	var context = this;
	var view = new AddView();
	var layout = new Layout();
	layout.main.show(view);

	view.on("add", function(uri)
	{
		var torrent = new Torrent({ uri: uri });
		torrent.save().success(function()
		{
			Backbone.history.navigate("", { trigger: true });
		});
	});
};

new Marionette.AppRouter(
{
	controller: new Controller(),
	appRoutes: {
		"": "list",
		"torrent/add": "add",
		"torrent/:id": "show"
	}
});
