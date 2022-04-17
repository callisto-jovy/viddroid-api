import {Gomo} from "./streamers/gomo";
import {Apimdb} from "./streamers/apimdb";
import {Streamer} from "./streamer";
import {Streamsb} from "./streamers/streamsb";
import {secureHeapUsed} from "crypto";
import {SuperStream} from "./streamers/super_stream";

export class Streamers {

    static readonly GOMO = {
        streamer: Gomo,
        name: "gomo",
        alias: []
    };

    static readonly API_MDB = {
        streamer: Apimdb,
        name: "apimdb",
        alias: []
    };

    static readonly STREAM_SB = {
        streamer: Streamsb,
        name: "streamsb",
        alias: ["sbfast", ]
    };

    static readonly SUPER_STREAM = {
        streamer: SuperStream,
        name: "super_stream",
        alias: ["superstream"]
    };

    static readonly STREAMERS = [
        Streamers.GOMO,
        Streamers.API_MDB,
        Streamers.STREAM_SB,
        Streamers.SUPER_STREAM,
    ];
}