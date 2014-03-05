
var request = require('request'),
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

        // try to check for URI encoding
        // TODO will probably have to make this better
        url = decodeURI(url) !== url ? url : encodeURI(url);

        console.log('starting page load ::', url);
        request({
            url : url,
        }, function (err, res, body) {

            if (err) { console.log(err); }
            console.log(body);

            // TODO error handling
            var dom = cheerio.load(body);
            if (!!selector && _.isString(selector)) {
                dom = dom(selector);
            }

            self.emit('loaded', dom);
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

//
// ###
var LoaderFactory = function () {
    var self = this;
    this.init = function (port) {
        // nothing to initialize really
        self.emit('initialized');
        console.log('Using clean loader.');
        return this;
    };

    this.create = function () {
        return new Loader();
    };
};

util.inherits(LoaderFactory, events.EventEmitter);
util.inherits(Loader, events.EventEmitter);

//
module.exports = new LoaderFactory();