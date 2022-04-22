import {Provider} from "../provider";
import fetch from "cross-fetch";
import {Streamers} from "../../streamer/streamers";

const baseURL: string = "https://seapi.link/?type=tmdb&max_results=1&id=";

function formatMovieRequest(movieID: number): string {
    return `${baseURL}${movieID}`;
}

function formatTVRequest(tvID: number, season: number, episode: number): string {
    return `${baseURL}${tvID}&season=${season}&episode=${episode}`;
}
//TODO: Check if the file is actually hosted.
function getSuperEmbedLink(apiReferral: string): Promise<string> {
    return fetch(apiReferral)
        .then(value =>
            value
                .json()
                .then(value1 => {
                        const servers: [] = value1["results"]
                            .sort((e: any) => e["quality"])
                            .filter((e: any) => e["server"] !== "doodstream" && e["server"] !== "streamtape");
                        if (servers.length >= 1) {
                            // @ts-ignore
                            return servers[0]["url"];
                        } else {
                            return Promise.reject("No results found. @superembed");
                        }
                    }
                ).catch(reason => Promise.reject(reason))
        ).catch(reason => Promise.reject(reason));
}

export class Superembed extends Provider {

    constructor() {
        super("superembed");
    }

    checkMovieAvailability(title: string, theMovieDBId: number): Promise<Boolean> {
        const url = formatMovieRequest(theMovieDBId);

        return fetch(url).then(value =>
            value.json()
                .then(value1 => value1["staus"] !== 404)
                .catch(reason => Promise.reject("Failed to translate response to json @Superembed: " + reason)))
            .catch(() => Promise.reject("Exception caused when checking superembed api"));
    }

    checkTVAvailability(title: string, theMovieDBId: number, season: number, episode: number): Promise<Boolean> {
        const url = formatTVRequest(theMovieDBId, season, episode);

        return fetch(url).then(value =>
            value.json()
                .then(value1 => value1["staus"] !== 404)
                .catch(reason => Promise.reject("Failed to translate response to json @Superembed: " + reason)))
            .catch(() => Promise.reject("Exception caused when checking superembed api"));
    }

    async provideMovie(title: string, theMovieDBId: number): Promise<{ url: string; init: HeadersInit, needsFurtherExtraction: boolean }> {
        const url = formatMovieRequest(theMovieDBId);
        return (new Streamers.SUPER_STREAM.streamer).resolveStreamURL(await getSuperEmbedLink(url));
    }

    async provideTV(title: string, theMovieDBId: number, season: number, episode: number): Promise<{ url: string; init: HeadersInit, needsFurtherExtraction: boolean }> {
        const url = formatTVRequest(theMovieDBId, season, episode);
        return (new Streamers.SUPER_STREAM.streamer).resolveStreamURL(await getSuperEmbedLink(url));
    }

}