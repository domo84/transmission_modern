var Backbone = require("backbone");
var settings = require("../../json/settings");

module.exports = Backbone.Model.extend(
{
	urlRoot: settings.api_url + "/torrent"
	/* LEGACY 
	url: function()
	{
		var base = settings.api_url + "/torrent";

		if (this.isNew())
		{
			return base;
		}

		return base + "/" + this.id;
	}
	*/
});
