var Radio = require("backbone.radio");
var Marionette = require("backbone.marionette");
var html = require("../html/items/add.html");

function Controller()
{
	var context = this;
}

Controller.prototype.add = function()
{
	var Layout = Marionette.ItemView(
	{
		template: html
	});
	var layout = new Layout();
	Radio.trigger("layout", "set", layout);
};

var router = new Marionette.AppRouter(
{
	controller: new Controller(),
	appRoutes: {
		"add": "add"
	}
});
