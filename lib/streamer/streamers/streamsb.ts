import {Streamer} from "../streamer";
import puppeteer from "puppeteer";
import {getUserAgent} from "../../util/wrapper";

export class Streamsb extends Streamer {

    constructor() {
        super("streamsb");
    }

    async resolveStreamURL(referral?: string, init?: HeadersInit): Promise<{ url: string; init: HeadersInit, needsFurtherExtraction: boolean }> {
        if (!referral) {
            return Promise.reject("Referral is non-existent");
        }

        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.goto(referral, {waitUntil: "domcontentloaded"});
        const response = await page.evaluate(`async function penis()  {
    function _0x4f5492(_0x106e73, _0x5e9d04, _0x343cca, _0x36f572, _0x13b558) {
        return _0xdb7fd8(_0x106e73 - 0x46, _0x5e9d04 - 0x13, _0x36f572 - -0x74, _0x36f572 - 0x18b, _0x106e73);
    }

    var _0xdf67c6 = {
        'gtxGZ': function (_0x451e71, _0x50fb61) {
            return _0x451e71(_0x50fb61);
        },
        'etdDv': function (_0xc654fd, _0x10ca95) {
            return _0xc654fd + _0x10ca95;
        },
        'fQPcR': function (_0x31278f, _0x108ca0) {
            return _0x31278f + _0x108ca0;
        },
        'ziquF': function (_0x48a197, _0x173ca9) {
            return _0x48a197 + _0x173ca9;
        },
        'XvXnm': _0xf7a096(0x407, 0x36f, 0x382, 0x5a1, 0x5ea) + _0xf7a096(0x68a, 0x506, 0x39f, 0x340, 0x691) + '/',
        'KupnX': _0xf7a096(0x38, -0x286, 0x2, 0x21f, -0x2a),
        'EPfrI': _0x14dbb5(0x6e1, 0x446, 0x99f, 0x6de, 0x961) + _0x34e89f(0x32a, 0x147, 0x318, -0x202, 0x418)
    };

    function _0x34e89f(_0x4ac7bd, _0x2dd21d, _0x368738, _0x2ffe59, _0x2d66b9) {
        return _0x39b752(_0x4ac7bd - 0x168, _0x2d66b9, _0x2dd21d - -0x220, _0x2ffe59 - 0xf6, _0x2d66b9 - 0x82);
    }

    var _0x159d14 = clientSide[_0xf7a096(-0x6f, -0x55, 0x254, 0x365, 0x2ba) + 'd'](-0x1 * -0x4e1 + 0x11b4 + -0x1689 * 0x1);

    function _0xf7a096(_0x54e9f4, _0x4ad2b8, _0x840f1, _0x202d69, _0x476505) {
        return _0x10afc4(_0x202d69, _0x4ad2b8 - 0x74, _0x840f1 - 0xd0, _0x840f1 - -0x4d1, _0x476505 - 0x43);
    }

    function _0x14dbb5(_0x10167b, _0x412f02, _0x557615, _0x2c4cf6, _0x5a50aa) {
        return _0x10afc4(_0x412f02, _0x412f02 - 0x13f, _0x557615 - 0x134, _0x2c4cf6 - 0x8, _0x5a50aa - 0x16);
    }

    function _0x24e3dd(_0x599220, _0x12e585, _0x42d45e, _0x535a14, _0x214e16) {
        return _0x42764e(_0x599220 - 0x510, _0x12e585 - 0x187, _0x42d45e - 0xe9, _0x214e16, _0x214e16 - 0x1b1);
    }

    _0x159d14 = clientSide[_0x34e89f(0x3d2, 0x29e, 0x35, 0x4eb, 0x4ae) + 'e'](clientSide[_0x34e89f(0x1eb, 0x29e, 0x458, 0xaf, 0x4c6) + 'e'](_0x159d14));
    var _0x46c237 = clientSide[_0x14dbb5(0x8a7, 0x73e, 0x6f7, 0x80a, 0x583) + 'e'](code);

    const _0x466ee5 = await _0xdf67c6[_0x14dbb5(0x931, 0x819, 0x5ee, 0x5d5, 0x8be)](axios, {
        'url': _0xdf67c6[_0x34e89f(-0x139, 0x223, 0x1b7, -0x132, 0x35c)](_0xdf67c6[_0x4f5492(0x4bf, 0x88c, 0x720, 0x6e0, 0x574)](_0xdf67c6[_0x24e3dd(0x755, 0xa21, 0x4e7, 0x41e, 0x7d5)](_0xdf67c6[_0x4f5492(0x4c4, 0x93b, 0x7f8, 0x63a, 0x85b)], _0x46c237), '/'), _0x159d14),
        'method': _0xdf67c6[_0x24e3dd(0x8c5, 0x7fa, 0x6d9, 0xb66, 0xc1c)],
        'headers': {
            'watchsb': _0xdf67c6[_0x34e89f(0x29, 0x25b, 0x452, 0x41f, 0x1ce)]
        }
    });
 return (_0x466ee5[_0xf7a096(0x960, 0x36e, 0x621, 0x538, 0x6a5)]);
} penis();`);
        await browser.close();
        return Promise.resolve({init: {"User-Agent": getUserAgent(), Referrer : referral}, url: response["stream_data"]["file"], needsFurtherExtraction: false});
    }
}