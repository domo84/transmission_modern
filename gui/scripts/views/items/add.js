var Marionette = require("backbone.marionette");
var html = require("html/items/add.html");

module.exports = Marionette.ItemView.extend(
{
	template: html,
	triggers: {
		"submit": "submit"
	},
	onSubmit: function()
	{
		var context = this;
		var uri = context.$el.find("input[name=uri]").val();
		context.trigger("add", uri);
	}
});
