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
		"click [data-action=start]": "start",
		"click [data-action=stop]": "stop",
		"click [data-action=remove]": "remove",
		"click [data-action=delete]": "delete"
	},
	onStart: function(view)
	{
		this.model.start();
	},
	onStop: function()
	{
		this.model.stop();
	},
	onRemove: function()
	{
		this.model.destroy();
	},
	onDelete: function()
	{
		this.model.purge();
	},
	onRender: function()
	{
		/*
		var context = this;
		var model = this.model;

		if(model.get("error") !== 0)
		{
			context.$el.addClass("error");
		}
		else if(model.get("status") === 6 || model.get("status") === 4)
		{
			context.$el.addClass("active");
		}
		else
		{
			context.$el.addClass("slumbering");
		}
		*/
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
