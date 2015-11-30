var Radio = require("backbone.radio");
var Marionette = require("backbone.marionette");
var html = require("../../../html/items/torrent.html");
var filesize = require("filesize");

module.exports = Marionette.ItemView.extend(
{
	tagName: "tr",
	attributes: {
		"class": "torrent"
	},
	triggers: {
		"click [data-action=resume]": "resume",
		"click [data-action=remove]": "remove",
		"click [data-action=delete]": "delete"
	},
	onResume: function()
	{
		Radio.trigger("torrent", "resume", this.model.id);
		console.log("Resume");
	},
	onRemove: function()
	{
		Radio.trigger("torrent", "remove", this.model.id);
		console.log("Remove");
	},
	onDelete: function()
	{
		Radio.trigger("torrent", "delete", this.model.id);
		console.log("Delete");
	},
	onRender: function()
	{
		var context = this;
		var model = this.model;
		switch(model.get("status"))
		{
			case 1:
			{
				context.$el.addClass("alert");
				break;
			}
			case 2:
			{
				context.$el.addClass("success");
				break;
			}
			case 3:
			{
				context.$el.addClass("running");
				break;
			}
		}
	},
	template: html,
	templateHelpers: function()
	{
		var model = this.model;

		return {
			pretty_totalSize: filesize(model.get("totalSize")),
			pretty_downloadedEver: filesize(model.get("downloadedEver")),
			pretty_uploadedEver: filesize(model.get("uploadedEver")),
			pretty_rateDownload: filesize(model.get("rateDownload")),
			pretty_rateUpload: filesize(model.get("rateUpload")),
			pretty_uploadRatio: model.get("uploadRatio").toFixed(2)
		};
	}
});
