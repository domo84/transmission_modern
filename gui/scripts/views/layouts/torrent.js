var Marionette = require("backbone.marionette");

module.exports = Marionette.LayoutView.extend(
{
	el: "body",
	template: false,
	regions: {
		main: "main"
	}
});
