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
    name: "gomo"
};
Streamers.API_MDB = {
    streamer: apimdb_1.Apimdb,
    name: "apimdb"
};
Streamers.STREAM_SB = {
    streamer: streamsb_1.Streamsb,
    name: "streamsb"
};
Streamers.SUPER_STREAM = {
    streamer: super_stream_1.SuperStream,
    name: "super_stream"
};
Streamers.STREAMERS = [
    Streamers.GOMO,
    Streamers.API_MDB
];
