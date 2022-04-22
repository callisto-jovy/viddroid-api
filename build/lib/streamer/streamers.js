"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Streamers = void 0;
const gomo_1 = require("./streamers/gomo");
const apimdb_1 = require("./streamers/apimdb");
const streamsb_1 = require("./streamers/streamsb");
const super_stream_1 = require("./streamers/super_stream");
class Streamers {
}
exports.Streamers = Streamers;
Streamers.GOMO = {
    streamer: gomo_1.Gomo,
    name: "gomo",
    alias: []
};
Streamers.API_MDB = {
    streamer: apimdb_1.Apimdb,
    name: "apimdb",
    alias: []
};
Streamers.STREAM_SB = {
    streamer: streamsb_1.Streamsb,
    name: "streamsb",
    alias: ["sbfast",]
};
Streamers.SUPER_STREAM = {
    streamer: super_stream_1.SuperStream,
    name: "super_stream",
    alias: ["superstream"]
};
Streamers.STREAMERS = [
    Streamers.GOMO,
    Streamers.API_MDB,
    Streamers.STREAM_SB,
    Streamers.SUPER_STREAM,
];
//# sourceMappingURL=streamers.js.map