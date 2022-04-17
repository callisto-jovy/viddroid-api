import express from "express";
import {Streamers} from "../../lib/streamer/streamers";
import {getUserAgent} from "../../lib/util/wrapper";

const router = express.Router();


router.get("/:streamer", async (req, res) => {
    const referral: any = req.query["url"];
    const streamer: string = req.params.streamer;
    const headers: HeadersInit = req.body?.headers;

    const response = async () => {
        for (const value of Streamers.STREAMERS) {
            if (value.streamerName == streamer) {
                return value.resolveStreamURL(referral, headers ?? {"User-Agent": getUserAgent()})
            }
        }
    }
    res.json(await response());
});

module.exports = router;