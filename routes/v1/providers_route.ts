import express from "express";
import {Providers} from "../../lib/provider/providers";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        status_code: 200,
        payload: Providers.PROVIDERS.map(value => value.providerName)
    });
});

module.exports = router;