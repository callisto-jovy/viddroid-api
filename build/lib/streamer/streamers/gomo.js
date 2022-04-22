"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gomo = void 0;
const wrapper_1 = require("../../util/wrapper");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const cheerio_1 = __importDefault(require("cheerio"));
const unpacker_1 = require("unpacker");
require("../streamer");
const streamer_1 = require("../streamer");
//TODO: Move into class, create new objects every time.
class Gomo extends streamer_1.Streamer {
    constructor() {
        super("gomo");
        this.tcExpr = /var tc = '(.+)';/;
        this.tokenRegex = /"_token": "(.+)"/g;
        this.functionRegex = /function (.*? { (.*)+})/gm;
        this.sliceRegex = /slice\s*\(\s*(\d)\s*,\s*(\d+)\)/g;
        this.rndNumRegex = /\+ "(\d+)"\s*\+\s*"(\d+)"/g;
        this.decodingAPI = "https://gomo.to/decoding_v3.php";
    }
    resolveStreamURL(referral, init) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!referral) {
                return Promise.reject("Referral is non-existent");
            }
            init !== null && init !== void 0 ? init : (init = { "User-Agent": (0, wrapper_1.getUserAgent)() });
            const response = yield (0, wrapper_1.fetchURL)(referral, init);
            if (response.status === 200) {
                const textValue = yield response.text();
                //Reset regular expressions
                /*
                tcExpr.lastIndex = 0;
                tokenRegex.lastIndex = 0;
                functionRegex.lastIndex = 0;
                sliceRegex.lastIndex = 0;
                rndNumRegex.lastIndex = 0;
    
                 */
                const tcMatch = this.tcExpr.exec(textValue);
                const tokenMatch = this.tokenRegex.exec(textValue);
                const funcMatch = this.functionRegex.exec(textValue);
                if (tcMatch == null) {
                    return Promise.reject("TC match is null.");
                }
                else if (tokenMatch == null) {
                    console.log(textValue);
                    return Promise.reject("Token match is null." + textValue);
                }
                else if (funcMatch == null) {
                    return Promise.reject("Function match is null.");
                }
                const tcGroup = tcMatch[1];
                const tokenGroup = tokenMatch[0];
                const sliceMatch = this.sliceRegex.exec(textValue);
                const rndNumberMatch = this.rndNumRegex.exec(textValue);
                if (sliceMatch != null) {
                    const sliceStart = sliceMatch[1];
                    const sliceEnd = sliceMatch[2];
                    let xToken = tcGroup
                        .substring(parseInt(sliceStart), parseInt(sliceEnd))
                        .split('')
                        .reverse()
                        .join('');
                    if (rndNumberMatch != null) {
                        xToken += rndNumberMatch.slice(1).join('');
                    }
                    console.log(referral);
                    const decodingAPIResponse = yield (0, cross_fetch_1.default)(this.decodingAPI, {
                        method: "POST",
                        headers: {
                            Origin: "https://gomo.to",
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "User-Agent": (0, wrapper_1.getUserAgent)(),
                            "x-token": xToken,
                            Referrer: referral,
                        },
                        body: `tokenCode=${tcGroup}&_token=${tokenGroup}`
                    });
                    if (decodingAPIResponse.status === 200) {
                        const json = yield decodingAPIResponse.json();
                        for (let i = 0; i < json.length; i++) {
                            const redirect = json[i];
                            if (redirect.startsWith('https://gomo')) {
                                const redirectResponse = yield (0, cross_fetch_1.default)(redirect, { headers: init });
                                if (redirectResponse.status === 200) {
                                    const redirectResponseText = yield redirectResponse.text();
                                    const $ = cheerio_1.default.load(redirectResponseText);
                                    const packed = $("script").filter((i, el) => $(el).html() == null ? false : $(el).html().startsWith('eval'))
                                        .html();
                                    if (packed == null) {
                                        continue;
                                    }
                                    if ((0, unpacker_1.detect)(packed)) {
                                        const unpacked = (0, unpacker_1.unpack)(packed);
                                        const sourceMatch = wrapper_1.sourceRegex.exec(unpacked);
                                        if (sourceMatch != null) {
                                            return {
                                                url: sourceMatch[0],
                                                init: { Referrer: redirect, "User-Agent": (0, wrapper_1.getUserAgent)() },
                                                needsFurtherExtraction: false
                                            };
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        return Promise.reject(`decoding api rejected the request with SC ${decodingAPIResponse.status}`);
                    }
                }
                else {
                    return Promise.reject("Slice match is null :" + textValue);
                }
            }
            else {
                return Promise.reject(`referral rejected the request with SC ${response.status}`);
            }
            return Promise.reject("Case failed");
        });
    }
}
exports.Gomo = Gomo;
//# sourceMappingURL=gomo.js.map