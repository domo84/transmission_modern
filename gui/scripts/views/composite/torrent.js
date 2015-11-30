var Marionette = require("backbone.marionette");
var TorrentItemView = require("scripts/views/items/torrent");

var html = require("html/composite/torrent.html");

module.exports = Marionette.CompositeView.extend(
{
	template: html,
	childView: TorrentItemView,
	childViewContainer: "tbody",
	attributes: {
		"width": "100%"
	}
});
