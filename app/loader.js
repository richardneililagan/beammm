
var phantom = require('phantom'),
    util = require('util'),
    events = require('events'),
    cheerio = require('cheerio'),
    _ = require('underscore')
    ;

var defaults = {
    selector : 'body'
};

// @class encapsulates the primary functions of getting markup
var Loader = function () {

    var self = this;

    /* privates */

    var loadByUrl = function (url, selector) {

        phantom.create(function (ph) {
            return ph.createPage(function (page) {
                return page.open(url, function (status) {
                    console.log('Opening [', url, '] :: ', status);

                    page.evaluate(
                        // parser
                        function () {
                            return document.documentElement.outerHTML;
                        },
                        // callback
                        function (result) {
                            var dom = cheerio.load(result);
                            if (!!selector && _.isString(selector)) {
                                dom = dom(selector);
                            }

                            self.emit('loaded', dom);
                            ph.exit();
                        });
                });
            });
        });

        return self;
    };

    var loadByOpts = function (opts) {

        var url = opts.url,
            selector = _.defaults(opts.selector || '', defaults.selector)
            ;

        if (!!url) {
            loadByUrl(url, selector);
        }

        return self;
    };

    /* public interface */

    // @function loads the markup of the supplised URL.
    this.load = function (opts, selector) {

        _.defaults(selector || '', defaults.selector);

        // Loader.load(function () { })
        if (_.isFunction(opts)) {
            // we want to use the function return for our load args
            opts = opts();
            // yeah, we don't return
        }

        // Loader.load('http://google.com')
        if (_.isString(opts)) {
            return loadByUrl(opts, selector);
        }

        else if (_.isArray(opts)) {
            // can't do anything if it's an array (for now I guess)
            return self;
        }

        else if (_.isObject(opts)) {
            return loadByOpts(opts);
        }
    };
};

util.inherits(Loader, events.EventEmitter);

module.exports = {
    create : function () {
        return new Loader();
    }
};