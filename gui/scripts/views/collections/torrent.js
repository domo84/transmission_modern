var Marionette = require("backbone.marionette");
var TorrentItemView = require("../items/torrent");

var html = require("../../../html/collections/torrent.html");

module.exports = Marionette.CompositeView.extend(
{
	template: html,
	childView: TorrentItemView,
	childViewContainer: "tbody",
	tagName: "table",
	attributes: {
		"width": "100%"
	}
});
