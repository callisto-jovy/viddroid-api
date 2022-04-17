import express from "express";
import {Providers} from "../../lib/provider/providers";

const router = express.Router();

router.get("/", async function (req, res, next) {
    const title: any = req.query["title"];
    const movieID: any = req.query["id"];
    const excludedProviders: any = req.query["excluded"];

    if (title === undefined || movieID === undefined) {
        res.json({
            error: "No arguments specified. Required: title & tmdb id.",
            status_code: 404,
        });
        return;
    }

    const response = async () => {
        for (const value of Providers.PROVIDERS) {
            if (excludedProviders != undefined && excludedProviders.includes(value.providerName)) {
                continue;
            }

            if (await value.checkMovieAvailability(title, movieID)) {
                return value.provideMovie(title, movieID)
                    .then(payload => {
                        return {
                            payload: payload,
                            status_code: 200
                        }
                    }).catch(reason => {
                        return {
                            error: reason,
                            status_code: 500,
                        }
                    });
            }
        }
    }
    res.json(await response());
});

router.get("/:provider", async function (req, res, next) {
    const title: any = req.query["title"];
    const movieID: any = req.query["id"];
    const provider: any = req.params.provider;

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

    const response = async () => {
        for (const value of Providers.PROVIDERS) {
            if (value.providerName == provider) {
                if (!await value.checkMovieAvailability(title, movieID)) {
                    return Promise.reject("Provider does not have the requested movie.");
                }

                return value.provideMovie(title, movieID)
                    .then(payload => {
                        return {
                            payload: payload,
                            status_code: 200
                        }
                    });
            }
        }

        return Promise.reject("Provider not found.");
    }
    res.json(await response().catch(reason => ({error: reason, status_code: 500})));
});


module.exports = router;