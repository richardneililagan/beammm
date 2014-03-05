
var _ = require('underscore'),
    BaseController = require('./basecontroller').BaseController,
    $ = require('cheerio')
    ;

var Controller = function () {

    var siteroot = 'http://thepiratebay.se',
        torrentroot = 'http://torrents.thepiratebay.se'
        ;

    var getTorrentLink = function (id, name) {
        return [
            torrentroot,
            id,
            (_.isString(name) && !_.isEmpty(name) ?
                name :
                'xxxxxxxxxxxx'.replace(
                    /[xy]/g,
                    function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);}
                )
            ) + '.torrent'
        ].join('/');
    };

    this.methods = {

        get : {

            // performs a search for torrents against TPB.
            // the result payload is sorted by the number of seeders, descending.
            search : this.handler(function (req, res, next) {

                var loader = this.createLoader(),
                    // ~/0/7/0 to sort by seeders
                    url = [siteroot, 'search', req.params.searchstring, 0, 7, 0].join('/')
                    ;

                console.log('URL resolved to', url);
                loader
                    .load(url, '#searchResult tr')
                    .on('loaded', function (dom) {

                        var records = dom.toArray(),
                            results = _.map(records, function (record) {

                                console.log('torrent id found :', (/\/(\d+)\//.exec(url)[1]));

                                var $cells = $(record).find('td'),
                                    $infocell = $cells.eq(1),
                                    url = $infocell.find('div.detName a').attr('href'),
                                    id = /\/(\d+)\//.exec(url)[1],
                                    seeders = $cells.eq(2).text(),
                                    leechers = $cells.eq(3).text(),
                                    meta = $infocell.find('font.detDesc').text().split(', '),
                                    rawdate = meta[0]
                                        .toLowerCase()
                                        .replace('uploaded ','')
                                        .replace(/\s/i, '-')
                                    ;

                                return {
                                    title : $infocell.find('.detName a').text(),
                                    url : url,
                                    torrent : getTorrentLink(id),
                                    seeders : seeders,
                                    leechers : leechers,
                                    uploaded : +new Date(rawdate),
                                    size : meta[1].replace('Size ',''),
                                    uploader : meta[2].replace('ULed by ',''),
                                    trusted : !!$infocell.find('a img[alt="Trusted"]').length,
                                    vip : !!$infocell.find('a img[alt="VIP"]').length
                                };
                            });

                        console.log(results);

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