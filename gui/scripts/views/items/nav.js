var Radio = require("backbone.radio");
var Marionette = require("backbone.marionette");

module.exports = Marionette.ItemView.extend(
{
	tagName: "nav",
	triggers: {
		"click [data-open=add-modal]": "openAddModal"
	},
	onOpenAddModal: function()
	{
		var e = $("#add-modal");
		var modal = new Foundation.Reveal(e);
		modal.open();
		modal.$element.find("input[tabindex=1]").focus();
	},
	template: require("../../../html/items/nav.html")
});
