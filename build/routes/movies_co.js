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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const baseURL = "https://www1.123movies.co";
const movieEndpoint = "/movie/";
const tvEndpoint = "/episode/";
const decodingAPI = "https://gomo.to/decoding_v3.php";
const tcExpr = RegExp(/var tc = '(.*)'/g);
const tokenRegex = RegExp(/"_token": "(.*)"/g);
const functionRegex = RegExp(/function (.*? { (.*)+})/gm);
const sliceRegex = RegExp(/slice\((\d),(\d+)\)/g);
const rndNumRegex = RegExp(/(\d+)"\+"(\d+)/g);
const sourceRegex = RegExp(/(?<=sources:\[{file:")[^"]+/g);
const onClickRegex = RegExp(/onclick="download_video\('([^']+)','([^']+)','([^']+)'\)/gm);
const directDownloadRegex = RegExp(/<a href="([^"]+)">Direct Download Link<\/a> /gm);
function formatTvRequest(title, season, episode) {
    return `${baseURL}${tvEndpoint}${title}-${season}x${episode}/watching.html`;
}
function formatMovieRequest(title) {
    return `${baseURL}${movieEndpoint}${title}/watching.html`;
}
/* GET users listing. */
router.get('/', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let title = req.query.title;
        let response = yield fetch(formatMovieRequest(''), {
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
            }
        }).then(value => {
            if (value.status !== 200) {
                return {
                    statusCode: "500",
                    payload: value.body,
                    error: "movies.co returned with SC != 200"
                };
            }
            else {
                //    var iFrame = value.body!..getElementsByTagName('iframe')[0];
                res.json({
                    statusCode: "200",
                    //      payload: iFrame,
                });
            }
        }).catch(reason => console.log(reason));
        res.json(response);
    });
});
module.exports = router;
