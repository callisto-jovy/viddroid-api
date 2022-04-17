import fetch from "cross-fetch";
import {Provider} from "../provider";
import {getUserAgent} from "../../util/wrapper";
import cheerio from "cheerio";

const baseURL: string = " https://fsapi.xyz/tmdb-movie/";

function formatMovieRequest(movieID: number): string {
    return `${baseURL}${movieID}`;
}

function formatTVRequest(tvID: number, season: number, episode: number): string {
    return `${baseURL}${tvID}-${season}-${episode}`;
}

//TODO: Implement such functionality
function formatAnimeRequest(animeID: number, season: number, episode: number): string {
    return `${baseURL}${animeID}-${season}-${episode}`;
}

function getFreeSteamingAPILink(apiReferral: string): Promise<string> {
    return fetch(apiReferral, {
        headers: {"User-Agent": getUserAgent()}
    })
        .then(value => value.text())
        .catch(reason => Promise.reject(reason));
}

export class FreeStreamingApi extends Provider {

    constructor() {
        super("fsapi");
    }

    checkMovieAvailability(title: string, theMovieDBId: number): Promise<Boolean> {
        const url = formatMovieRequest(theMovieDBId);

        return fetch(url).then(() => true)
            .catch(reason => Promise.reject(reason));
    }

    checkTVAvailability(title: string, theMovieDBId: number, season: number, episode: number): Promise<Boolean> {
        const url = formatTVRequest(theMovieDBId, season, episode);

        return fetch(url).then(() => true)
            .catch(reason => Promise.reject(reason));
    }

    async provideMovie(title: string, theMovieDBId: number): Promise<{ url: string; init: HeadersInit }> {
        const url = formatMovieRequest(theMovieDBId);

        const apiResult: string = await getFreeSteamingAPILink(url)
            .catch(reason => Promise.reject(reason));

        const $ = cheerio.load(apiResult);
        const referral: string | undefined = $(".play-btn").first().attr("href");
        if (!referral) {
            return Promise.reject("Referral was undefined.");
        }

        const fetchReferral: Response = await fetch(referral, {
            headers: {
                "User-Agent": getUserAgent(),
                "Referrer": url
            }
        }).catch(reason => Promise.reject("Failed to fetch gogoplay with reason: " + reason));


        return {url: fetchReferral.url, init: fetchReferral.headers};
    }

    async provideTV(title: string, theMovieDBId: number, season: number, episode: number): Promise<{ url: string; init: HeadersInit }> {
        const url = formatTVRequest(theMovieDBId, season, episode);

        const apiResult: string = await getFreeSteamingAPILink(url)
            .catch(reason => Promise.reject(reason));

        const $ = cheerio.load(apiResult);
        const referral: string | undefined = $(".play-btn").first().attr("href");
        if (!referral) {
            return Promise.reject("Referral was undefined.");
        }

        const fetchReferral: Response = await fetch(referral, {
            headers: {
                "User-Agent": getUserAgent(),
                "Referrer": url
            }
        }).catch(reason => Promise.reject("Failed to fetch gogoplay with reason: " + reason));

        return {url: fetchReferral.url, init: fetchReferral.headers};
    }

}