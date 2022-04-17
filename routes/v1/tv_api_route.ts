import express from "express";
import {Providers} from "../../lib/provider/providers";

const router = express.Router();


router.get('/', async (req, res) => {
    const title: any = req.query['title'];
    const movieID: any = req.query['id'];
    const excludedProviders: any = req.query['excluded'];
    const season: any = req.query['season'];
    const episode: any = req.query['episode'];

    if (!title || !movieID || !season || !episode) {
        res.json({
            "error": "No arguments specified. Required: title & tmdb id & the episode & the season.",
            "status_code": 404,
        });
        return;
    }

    const response = async () => {
        for (const value of Providers.PROVIDERS) {
            if (excludedProviders != null && excludedProviders.includes(value.providerName)) {
                continue;
            }

            if (await value.checkTVAvailability(title, movieID, season, episode)) {
                return value.provideTV(title, movieID, season, episode)
                    .then(payload => {
                        return {
                            "payload": payload,
                            "status_code": 200
                        }
                    }).catch(reason => {
                        return {
                            "error": reason,
                            "status_code": 500,
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
    const season: any = req.query['season'];
    const episode: any = req.query['episode'];

    if (provider === undefined) {
        res.json({
            "error": "provider needs to be specified. For all providers, request: /movie.",
            "status_code": 404
        });
    }

    if (!title || !movieID || !season || !episode) {
        res.json({
            "error": "No arguments specified. Required: title & tmdb id & the episode & the season.",
            "status_code": 404,
        });
        return;
    }

    const response = async () => {
        for (const value of Providers.PROVIDERS) {
            if (value.providerName == provider.slice(1)) {
                if (!await value.checkTVAvailability(title, movieID, season, episode)) {
                    return Promise.reject("Provider does not have the requested movie.");
                }

                return value.provideTV(title, movieID, season, episode)
                    .then(payload => {
                        return {
                            "payload": payload,
                            "status_code": 200
                        }
                    });
            }
        }

        return Promise.reject("Provider not found.");
    }
    res.json(await response().catch(reason => {
        return {"error": reason, "status_code": 500}
    }));
});

module.exports = router;