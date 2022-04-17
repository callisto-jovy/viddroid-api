import {MoviesCo} from "./providers/moviesco/movies_co";
import {Apimdb} from "./providers/apimdb/apimdb";
import {Superembed} from "./providers/superembed/superembed";

export class Providers {

    static readonly PROVIDERS = [
        new MoviesCo,
        new Apimdb,
        new Superembed,
    ];
}