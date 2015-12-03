var $ = require("jquery");
var Backbone = require("backbone");
var Radio = require("backbone.radio");
var Marionette = require("backbone.marionette");
var TorrentCollection = require("scripts/collections/torrent");
var Torrent = require("scripts/models/torrent");
var TorrentCompositeView = require("scripts/views/composite/torrent");
var AddView = require("scripts/views/items/add");
var Layout = require("scripts/views/layouts/torrent");
var Poller = require("scripts/utils/poller");

function Controller()
{
}

Controller.prototype.list = function()
{
	var context = this;
	var torrents = new TorrentCollection();
	var poller = new Poller(torrents);
	var view = new TorrentCompositeView({ collection: torrents });
	var layout = new Layout();

	layout.main.show(view);

	$(window).blur(() => poller.stop());
	$(window).focus(() => poller.start());

	poller.on("tick", () => view.render());

	torrents.fetch();
	torrents.fetch().done(() => poller.start());

	view.on("destroy", () => poller.stop());
	view.on("childview:delete", (view) => view.model.purge());
	view.on("childview:remove", (view) => view.model.destroy());
	view.on("childview:stop", (view) => view.model.stop());
	view.on("childview:start", (view) => view.model.start());

	console.log("list", "all");
};

Controller.prototype.show = function(id)
{
	console.log("torrent", "show", id);
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
