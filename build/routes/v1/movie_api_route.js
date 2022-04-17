"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const moviesCo = __importStar(require("../../lib/providers/moviesco/movies_co"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const cheerio_1 = __importDefault(require("cheerio"));
const streamers_1 = require("../../lib/streamer/streamers");
const router = express_1.default.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let title = req.query['title'];
        let response = yield (0, cross_fetch_1.default)(moviesCo.formatMovieRequest(title), {
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
            }
        }).then((value) => __awaiter(this, void 0, void 0, function* () {
            if (value.status === 200) {
                return {
                    statusCode: 200,
                    payload: yield value.text().then(textValue => {
                        let $ = cheerio_1.default.load(textValue);
                        return new streamers_1.Streamers.GOMO().resolveStreamURL($('iframe').first().attr('src'));
                    }).catch(reason => `Error: ${reason}`),
                };
            }
            else {
                return {
                    statusCode: 500,
                    payload: yield value.text().catch(reason => 'Payload failed to load ' + reason),
                    error: 'movies.co returned with SC != 200'
                };
            }
        })).catch(reason => console.log(reason));
        res.json(response);
    });
});
module.exports = router;
