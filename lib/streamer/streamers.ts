import {Gomo} from "./streamers/gomo";
import {Apimdb} from "./streamers/apimdb";
import {Streamer} from "./streamer";

export class Streamers {

    static readonly GOMO: Streamer = new Gomo;
    static readonly API_MDB: Streamer = new Apimdb;

    static readonly STREAMERS = [
        Streamers.GOMO,
        Streamers.API_MDB
    ];

}