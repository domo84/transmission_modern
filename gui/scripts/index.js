var Backbone = require("backbone");
var Radio = require("backbone.radio");
var Marionette = require("backbone.marionette");
var _ = require("lodash");
var fs = require("fs");

var NavView = require("./views/items/nav");

var Layout = Marionette.LayoutView.extend(
{
    el: "body",
    regions:
    {
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

        Radio.DEBUG = true;

        console.log("initializing");
    },
    onStart: function(options)
    {
        // Keyboard bindings
        var $ = require("jquery");
        $("body").keyup(function(event)
        {
            // Ignore if the cursor is in an input field
            if (event.target.localName !== "input")
            {
                switch (event.which)
                {
                    case 65: // a
                        {
                            Backbone.history.navigate("",
                            {
                                trigger: true
                            });
                            break;
                        }
                    case 78: // n
                        {
                            Backbone.history.navigate("torrent/add",
                            {
                                trigger: true
                            });
                            break;
                        }
                    case 83: // s
                        {
                            $("header").find("input[type=search]").focus();
                            break;
                        }
                }
            }
        });

        console.log("onStart", "begin");

        var context = this;
        var layout = context.layout;

        var navView = new NavView();

        layout.header.show(navView);

        Backbone.history.start();

        console.log("onStart", "end");
    }
});

var app = new App();
app.start();
