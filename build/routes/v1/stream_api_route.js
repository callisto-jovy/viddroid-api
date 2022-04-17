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
const streamers_1 = require("../../lib/streamer/streamers");
const wrapper_1 = require("../../lib/util/wrapper");
const router = express_1.default.Router();
router.get("/:streamer", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const referral = req.query["url"];
    const streamer = req.params.streamer;
    const headers = (_a = req.body) === null || _a === void 0 ? void 0 : _a.headers;
    const response = () => __awaiter(void 0, void 0, void 0, function* () {
        for (let value of streamers_1.Streamers.STREAMERS) {
            if (value.name == streamer) {
                return (new value.streamer).resolveStreamURL(referral, headers !== null && headers !== void 0 ? headers : { "User-Agent": (0, wrapper_1.getUserAgent)() });
            }
        }
    });
    res.json(yield response());
}));
module.exports = router;
