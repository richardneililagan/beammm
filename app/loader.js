
var phantom = require('phantom'),
    util = require('util'),
    events = require('events'),
    cheerio = require('cheerio'),
    _ = require('underscore')
    ;

var defaults = {
    selector : 'body'
};

// instance of the phantomjs browser
var _ph = null;

// @class encapsulates the primary functions of getting markup
var Loader = function () {

    var self = this;

    /* privates */

    var loadByUrl = function (url, selector) {

        // try to check for URI encoding
        // TODO will probably have to make this better
        url = decodeURI(url) !== url ? url : encodeURI(url);

        console.log('starting page load ::', url);
        _ph.createPage(function (page) {

            console.log('Opening [', url, ']');
            return page.open(url, function (status) {
                console.log('... completed with status', status);
                page.evaluate(
                    // parser
                    function () {
                        return document.documentElement.outerHTML;
                    },
                    // callback
                    function (result) {

                        console.log(
                            '... evaluate complete. Processing for callback with selector',
                            selector
                            );

                        var dom = cheerio.load(result);
                        if (!!selector && _.isString(selector)) {
                            dom = dom(selector);
                        }

                        self.emit('loaded', dom);
                        page.close();
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

//
// ###
var LoaderFactory = function () {
    var self = this;
    this.init = function (port) {
        if (!_ph) {
            console.log('Initializing PhantomJS on port', port);
            phantom.create('', { port : port }, function (ph) {
                console.log('PhantomJS process active on port', port);
                _ph = ph;
                self.emit('initialized');
            });
        }
        else {
            console.log('INFO : Phantom already active.');
        }

        return this;
    };

    this.create = function () {
        return new Loader();
    };
};

util.inherits(LoaderFactory, events.EventEmitter);

//
module.exports = new LoaderFactory();