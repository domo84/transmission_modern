var Backbone = require("backbone");
var Radio = require("backbone.radio");
var Marionette = require("backbone.marionette");
var _ = require("lodash");
var fs = require("fs");

var NavView = require("./views/items/nav");

var Layout = Marionette.LayoutView.extend(
{
	el: "body",
	regions: {
		header: "header",
		main: "main",
		footer: "footer",
		modals: "#modals"
	},
	onShow: function()
	{
		console.log("layout", "show");
	},
	onRender: function()
	{
		console.log("layout", "render");
	}
});

var TorrentModule = require("./modules/torrent.module");

var App = Marionette.Application.extend(
{
	initialize: function()
	{
		var context = this;

		context.layout = new Layout();

		Radio.on("layout", "set", function(view)
		{
			context.layout.main.show(view);
		});

		console.log("initializing");
	},
	onStart: function(options)
	{
		console.log("starting", options);

		Backbone.history.start();

		var context = this;
		var layout = context.layout;

		var navView = new NavView();

		layout.header.show(navView);

		console.log("start");
	}
});

var app = new App();
app.start();
