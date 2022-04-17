import express from "express";

const app = express();
const movieAPI = require("./v1/movie_api_route");
const streamerAPI = require("./v1/stream_api_route");
const tvAPI = require("./v1/tv_api_route");
const providers = require("./v1/providers_route");

app.use("/api/v1/movie", movieAPI);
app.use("/api/v1/streamer", streamerAPI);
app.use("/api/v1/tv", tvAPI);
app.use("/api/v1/providers", providers);


app.get("/", (req, res) =>
    res.json({
        error: "Invalid path",
        status_code: 404
    }));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Express API running on http://localhost:${PORT}`);
});