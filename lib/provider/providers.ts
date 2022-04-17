import {MoviesCo} from "./providers/movies_co";
import {Apimdb} from "./providers/apimdb";
import {Superembed} from "./providers/superembed";
import {FreeStreamingApi} from "./providers/free_streaming_api";

export class Providers {

    static readonly PROVIDERS = [
        new MoviesCo,
        new Apimdb,
        new Superembed,
        new FreeStreamingApi,
    ];
}