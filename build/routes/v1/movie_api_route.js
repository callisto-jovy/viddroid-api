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
const providers_1 = require("../../lib/provider/providers");
const router = express_1.default.Router();
router.get("/", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const title = req.query["title"];
        const movieID = req.query["id"];
        const excludedProviders = req.query["excluded"];
        if (title === undefined || movieID === undefined) {
            res.json({
                error: "No arguments specified. Required: title & tmdb id.",
                status_code: 404,
            });
            return;
        }
        const response = () => __awaiter(this, void 0, void 0, function* () {
            for (const value of providers_1.Providers.PROVIDERS) {
                if (excludedProviders != undefined && excludedProviders.includes(value.providerName)) {
                    continue;
                }
                if (yield value.checkMovieAvailability(title, movieID)) {
                    return value.provideMovie(title, movieID)
                        .then(payload => ({
                        payload: payload,
                        status_code: 200
                    })).catch(reason => ({
                        error: reason,
                        status_code: 500,
                    }));
                }
            }
            return Promise.reject(`No suitable provider found for ${title} with id ${movieID}`);
        });
        res.json(yield response());
    });
});
router.get("/:provider", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const title = req.query["title"];
        const movieID = req.query["id"];
        const provider = req.params.provider;
        if (provider === undefined) {
            res.json({
                error: "provider needs to be specified. For all providers, request: /movie.",
                status_code: 404
            });
        }
        if (title === undefined || movieID === undefined) {
            res.json({
                error: "No arguments specified. Required: title & tmdb id.",
                status_code: 404,
            });
            return;
        }
        const response = () => __awaiter(this, void 0, void 0, function* () {
            for (const value of providers_1.Providers.PROVIDERS) {
                if (value.providerName == provider) {
                    if (!(yield value.checkMovieAvailability(title, movieID))) {
                        return Promise.reject("Provider does not have the requested movie.");
                    }
                    return value.provideMovie(title, movieID)
                        .then(payload => ({
                        payload: payload,
                        status_code: 200
                    }));
                }
            }
            return Promise.reject("Provider not found.");
        });
        res.json(yield response().catch(reason => ({ error: reason, status_code: 500 })));
    });
});
module.exports = router;
