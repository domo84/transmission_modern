var Marionette = require("backbone.marionette");
var html = require("../../../html/views/item/torrent.html");

module.exports = Marionette.ItemView.extend(
{
	tagName: "article",
	attributes: {
		"class": "torrent"
	},
	template: html
});
