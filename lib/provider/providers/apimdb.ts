import {Provider} from "../provider";
import {Streamers} from "../../streamer/streamers";
import {fetchURL, getUserAgent} from "../../util/wrapper";

const baseURL: string = "https://v2.apimdb.net";
const movieEndpoint: string = "/e/tmdb/movie/";
const tvEndpoint: string = "/e/tmdb/tv/";

function formatMovieRequest(movieID: number): string {
    return `${baseURL}${movieEndpoint}${movieID}`;
}

function formatTVRequest(tvID: number, season: number, episode: number): string {
    return `${baseURL}${tvEndpoint}${tvID}/${season}/${episode}/`;
}

export class Apimdb extends Provider {

    constructor() {
        super("apimdb");
    }

    checkMovieAvailability(title: string, theMovieDBId: number): Promise<Boolean> {
        const url: string = formatMovieRequest(theMovieDBId);

        return fetchURL(url)
            .then((value) => value.text().then(value1 => !value1.includes("404")).catch(() => false))
            .catch(() => false);
    }

    checkTVAvailability(title: string, theMovieDBId: number, season: number, episode: number): Promise<Boolean> {
        const url: string = formatTVRequest(theMovieDBId, season, episode);

        return fetchURL(url)
            .then((value) => value.text().then(value1 => !value1.includes("404")).catch(() => false))
            .catch(() => false);
    }

    provideMovie(title: string, theMovieDBId: number): Promise<{ url: string; init: HeadersInit, needsFurtherExtraction: boolean }> {
        const url: string = formatMovieRequest(theMovieDBId);
        return (new Streamers.API_MDB.streamer).resolveStreamURL(url, {
            "Referrer": "https://apimdb.net/",
            "User-Agent": getUserAgent()
        });
    }

    provideTV(title: string, theMovieDBId: number, season: number, episode: number): Promise<{ url: string; init: HeadersInit , needsFurtherExtraction: boolean}> {
        const url: string = formatTVRequest(theMovieDBId, season, episode);
        return (new Streamers.API_MDB.streamer).resolveStreamURL(url, {
            "Referrer": "https://apimdb.net/",
            "User-Agent": getUserAgent()
        });
    }

}

