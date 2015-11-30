var Backbone = require("backbone");
var Radio = require("backbone.radio");
var Marionette = require("backbone.marionette");

module.exports = Marionette.ItemView.extend(
{
	template: require("../../../html/items/nav.html"),
	tagName: "nav",
	triggers: {
		"click [data-nav=home]": "home",
		"click [data-nav=torrent-add]": "addTorrent"
	},
	onHome: function()
	{
		Backbone.history.navigate("", { trigger: true });
	},
	onAddTorrent: function()
	{
		Backbone.history.navigate("torrent/add", { trigger: true });
	}
});
