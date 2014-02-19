
var _ = require('underscore'),
    BaseController = require('./basecontroller').BaseController,
    $ = require('cheerio')
    ;

var Controller = function () {

    var siteroot = 'http://thepiratebay.se';

    this.methods = {
        get : {
            search : this.handler(function (req, res, next) {

                var loader = this.createLoader();
                loader
                    .load(
                        // ~/0/7/0 to sort by seeders
                        [siteroot, 'search', req.params.searchstring, 0, 7, 0].join('/'),
                        '#searchResult tbody tr'
                        )
                    .on('loaded', function (dom) {

                        var records = dom.toArray(),
                            results = _.map(records, function (record) {

                                var $cells = $(record).find('td'),
                                    $infocell = $cells.eq(1),
                                    seeders = $cells.eq(2).text(),
                                    leechers = $cells.eq(3).text(),
                                    meta = $infocell.find('.detDesc').text().split(', '),
                                    rawdate = meta[0]
                                        .toLowerCase()
                                        .replace('uploaded ','')
                                        .replace(/\s/i, '-')
                                    ;

                                return {
                                    title : $infocell.find('.detName a').text(),
                                    url : $infocell.find('.detName a').attr('href'),
                                    seeders : seeders,
                                    leechers : leechers,
                                    uploaded : +new Date(rawdate),
                                    size : meta[1].replace('Size ',''),
                                    uploader : meta[2].replace('ULed by ',''),
                                    trusted : !!$infocell.find('a img[alt="Trusted"]').length,
                                    vip : !!$infocell.find('a img[alt="VIP"]').length
                                };
                            });

                        res.send(results);
                        next();
                    });

            }, ['searchstring'])
        }
    };
};

require('util').inherits(Controller, BaseController);

module.exports = {
    create : function () {
        return new Controller();
    }
};