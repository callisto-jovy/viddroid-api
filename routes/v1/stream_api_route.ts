import express from "express";
import {Streamers} from "../../lib/streamer/streamers";
import {getUserAgent} from "../../lib/util/wrapper";
import {Streamer} from "../../lib/streamer/streamer";

const router = express.Router();

router.post("/:streamer", async (req, res) => {
    const referral: any = req.query["url"];
    const streamer: string = req.params.streamer;
    const headers: HeadersInit = req.body?.headers;

    const response = async () => {
        for (let value of Streamers.STREAMERS) {
            if (value.name == streamer || value.alias.includes(streamer)) {
                return (new value.streamer).resolveStreamURL(referral, headers ?? {"User-Agent": getUserAgent()})
            }
        }
        return Promise.reject("No suitable streamer found for your request.");
    }
    res.json(await response());
});

module.exports = router;