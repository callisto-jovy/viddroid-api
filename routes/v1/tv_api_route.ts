import express from "express";
import {Providers} from "../../lib/provider/providers";

const router = express.Router();


router.get("/", async (req, res) => {
    const title: any = req.query["title"];
    const tvID: any = req.query["id"];
    const excludedProviders: any = req.query["excluded"];
    const season: any = req.query["season"];
    const episode: any = req.query["episode"];

    if (!title || !tvID || !season || !episode) {
        res.json({
            error: "No arguments specified. Required: title & tmdb id & the episode & the season.",
            status_code: 404,
        });
        return;
    }

    const response = async () => {
        for (const value of Providers.PROVIDERS) {
            if (excludedProviders != null && excludedProviders.includes(value.providerName)) {
                continue;
            }

            if (await value.checkTVAvailability(title, tvID, season, episode)) {
                return value.provideTV(title, tvID, season, episode)
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
    const tvID: any = req.query["id"];
    const provider: any = req.params.provider;
    const season: any = req.query["season"];
    const episode: any = req.query["episode"];

    if (provider === undefined) {
        res.json({
            error: "provider needs to be specified. For all providers, request: /movie.",
            status_code: 404
        });
    }

    if (!title || !tvID || !season || !episode) {
        res.json({
            error: "No arguments specified. Required: title & tmdb id & the episode & the season.",
            status_code: 404,
        });
        return;
    }

    const response = async () => {
        for (const value of Providers.PROVIDERS) {
            if (value.providerName == provider) {
                if (!await value.checkTVAvailability(title, tvID, season, episode)) {
                    return Promise.reject("Provider does not have the requested movie.");
                }

                return value.provideTV(title, tvID, season, episode)
                    .then(payload => {
                        return {
                            payload,
                            status_code: 200
                        }
                    });
            }
        }
        return Promise.reject(`No suitable provider found for ${title} with id ${tvID}`);
    }
    res.json(await response().catch(reason => {
        return {error: reason, status_code: 500}
    }));
});

module.exports = router;