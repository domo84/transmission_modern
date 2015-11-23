var Marionette = require("backbone.marionette");
var TorrentItemView = require("../items/torrent");

module.exports = Marionette.CollectionView.extend(
{
	childView: TorrentItemView
});
