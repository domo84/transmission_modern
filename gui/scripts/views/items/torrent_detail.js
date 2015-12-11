var Marionette = require("backbone.marionette");
var html = require("html/items/torrent_detail.html");

module.exports = Marionette.ItemView.extend(
{
	tagName: "article",
	template: html,
	templateHelpers: function()
	{
		var model = this.model;
		var attributes = [];
		Object.keys(model.attributes).map(function(key)
		{
			attributes.push(
			{
				key: key,
				value: model.get(key)
			});
		});

		return {
			attributes: attributes
		};
	}
});
