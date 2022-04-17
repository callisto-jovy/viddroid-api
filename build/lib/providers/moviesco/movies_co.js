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
exports.formatMovieRequest = exports.formatTvRequest = exports.directDownloadRegex = exports.onClickRegex = exports.sourceRegex = exports.rndNumRegex = exports.sliceRegex = exports.functionRegex = exports.tokenRegex = exports.tcExpr = exports.decodingAPI = exports.tvEndpoint = exports.movieEndpoint = exports.baseURL = void 0;
exports.baseURL = 'https://www1.123movies.co';
exports.movieEndpoint = "/movie/";
exports.tvEndpoint = "/episode/";
exports.decodingAPI = "https://gomo.to/decoding_v3.php";
exports.tcExpr = RegExp(/var tc = '(.*)'/g);
exports.tokenRegex = RegExp(/"_token": "(.*)"/g);
exports.functionRegex = RegExp(/function (.*? { (.*)+})/gm);
exports.sliceRegex = RegExp(/slice\s*\(\s*(\d)\s*,\s*(\d+)\)/g);
exports.rndNumRegex = RegExp(/\+ "(\d+)"\s*\+\s*"(\d+)"/g);
exports.sourceRegex = RegExp(/(?<=sources:\[{file:")[^"]+/g);
exports.onClickRegex = RegExp(/onclick="download_video\('([^']+)','([^']+)','([^']+)'\)/gm);
exports.directDownloadRegex = RegExp(/<a href="([^"]+)">Direct Download Link<\/a> /gm);
function formatTvRequest(title, season, episode) {
    return `${exports.baseURL}${exports.tvEndpoint}${title}-${season}x${episode}/watching.html`;
}
exports.formatTvRequest = formatTvRequest;
function formatMovieRequest(title) {
    return `${exports.baseURL}${exports.movieEndpoint}${title}/watching.html`;
}
exports.formatMovieRequest = formatMovieRequest;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const user_agents_1 = __importDefault(require("user-agents"));
class MoviesCo extends Provider {
    provideMovie(title, theMovieDBId) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = formatMovieRequest(title);
            let resp = yield (0, cross_fetch_1.default)(url, {
                headers: {
                    "User-Agent": new user_agents_1.default().random().toString()
                }
            });
            return { url: resp.url, init: { "User-Agent": "Penis" } };
        });
    }
    provideTV(title, theMovieDBId, season, episode) {
        return Promise.reject('');
    }
}
