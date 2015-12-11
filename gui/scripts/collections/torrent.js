var Backbone = require("backbone");
var Torrent = require("../models/torrent");
var settings = require("../../json/settings");

module.exports = Backbone.Collection.extend(
{
	model: Torrent,
	url: settings.api_url + "/torrent",
	comparator: "addedDate",
	redraw: function()
	{
		this.reset(this.models);
	}
});
