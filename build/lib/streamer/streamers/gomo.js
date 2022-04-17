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
const movies_co_1 = require("../../providers/moviesco/movies_co");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const cheerio_1 = __importDefault(require("cheerio"));
const unpacker_1 = require("unpacker");
require("../streamer");
class Gomo {
    resolveStreamURL(referral, init) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!referral) {
                return Promise.reject('referral is empty');
            }
            init !== null && init !== void 0 ? init : (init = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36' });
            let response = yield (0, cross_fetch_1.default)(referral, {
                headers: init
            });
            if (response.status === 200) {
                let textValue = yield response.text();
                let tcMatch = movies_co_1.tcExpr.exec(textValue);
                let tokenMatch = movies_co_1.tokenRegex.exec(textValue);
                let funcMatch = movies_co_1.functionRegex.exec(textValue);
                if (tcMatch != null && tokenMatch != null && funcMatch != null) {
                    let tcGroup = tcMatch[1];
                    let tokenGroup = tokenMatch[0];
                    let sliceMatch = movies_co_1.sliceRegex.exec(textValue);
                    let rndNumberMatch = movies_co_1.rndNumRegex.exec(textValue);
                    if (sliceMatch != null) {
                        let sliceStart = sliceMatch[1];
                        let sliceEnd = sliceMatch[2];
                        let xToken = tcGroup
                            .substring(parseInt(sliceStart), parseInt(sliceEnd))
                            .split('')
                            .reverse()
                            .join('');
                        if (rndNumberMatch != null) {
                            xToken += rndNumberMatch.slice(1).join('');
                        }
                        let decodingAPIResponse = yield (0, cross_fetch_1.default)(movies_co_1.decodingAPI, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
                                'x-token': xToken,
                                'Referrer': referral,
                            },
                            body: `tokenCode=${tcGroup}&_token=${tokenGroup}`
                        });
                        if (decodingAPIResponse.status === 200) {
                            let json = yield decodingAPIResponse.json();
                            for (let i = 0; i < json.length; i++) {
                                let redirect = json[i];
                                if (redirect.startsWith('https://gomo')) {
                                    let redirectResponse = yield (0, cross_fetch_1.default)(redirect, { headers: init });
                                    if (redirectResponse.status === 200) {
                                        let redirectResponseText = yield redirectResponse.text();
                                        let $ = cheerio_1.default.load(redirectResponseText);
                                        let packed = $('script').filter((i, el) => $(el).html() == null ? false : $(el).html().startsWith('eval'))
                                            .html();
                                        if (packed == null) {
                                            return Promise.reject('No packed js found');
                                        }
                                        if ((0, unpacker_1.detect)(packed)) {
                                            let unpacked = (0, unpacker_1.unpack)(packed);
                                            let sourceMatch = movies_co_1.sourceRegex.exec(unpacked);
                                            if (sourceMatch != null) {
                                                console.log(sourceMatch);
                                                return { url: sourceMatch[0], init: { 'Referrer': redirect } };
                                            }
                                        }
                                        else {
                                            return Promise.reject('Packer did not find packed js');
                                        }
                                    }
                                    else {
                                        return Promise.reject(`Redirect rejected request with SC ${redirectResponse.status}`);
                                    }
                                }
                            }
                        }
                        else {
                            return Promise.reject(`decoding api rejected the request with SC ${decodingAPIResponse.status}`);
                        }
                    }
                }
                else {
                    return Promise.reject('regex returned null');
                }
            }
            else {
                return Promise.reject(`referral rejected the request with SC ${response.status}`);
            }
            return Promise.reject('Case failed');
        });
    }
}
exports.Gomo = Gomo;
