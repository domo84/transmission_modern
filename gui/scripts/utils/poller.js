var Backbone = require("backbone");
var _ = require("lodash");

function Poller(unit)
{
	_.extend(this, Backbone.Events);

	var context = this;
	context.unit = unit;
	context.interval = 10000;
	context.timer = false;
}

Poller.prototype.start = function()
{
	var context = this;
	context.trigger("start");
	context.unit.fetch();
	context._tick();
};

Poller.prototype._tick = function()
{
	context = this;
	context.timer = setTimeout(function()
	{
		context.unit.fetch().done(function()
		{
			context.trigger("tick");
			context._tick();
		});
	}, context.interval);
};

Poller.prototype.stop = function()
{
	var context = this;

	context.trigger("stop");

	if(context.timer)
	{
		clearTimeout(context.timer);
	}
};

Poller.prototype.reset = function()
{
	var context = this;
	context.trigger("reset");
	context.stop();
	context.start();
};

module.exports = Poller;
