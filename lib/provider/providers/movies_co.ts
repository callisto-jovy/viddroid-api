import cheerio from "cheerio";
import {Streamers} from "../../streamer/streamers";
import {Provider} from "../provider";
import {fetchURL} from "../../util/wrapper";

const baseURL: string = 'https://www1.123movies.co';

const movieEndpoint: string = "/movie/";

const tvEndpoint: string = "/episode/";

export const onClickRegex = RegExp(/onclick="download_video\('([^']+)','([^']+)','([^']+)'\)/gm);

export const directDownloadRegex = RegExp(/<a href="([^"]+)">Direct Download Link<\/a> /gm);

function formatTvRequest(title: string, season: number, episode: number): string {
    return `${baseURL}${tvEndpoint}${title}-${season}x${episode}/watching.html`;
}

function formatMovieRequest(title: string): string {
    return `${baseURL}${movieEndpoint}${title}/watching.html`;
}

export class MoviesCo extends Provider {

    constructor() {
        super('moviesco');
    }

    async provideMovie(title: string, theMovieDBId: number): Promise<{ url: string; init: HeadersInit, needsFurtherExtraction: boolean }> {
        const url: string = formatMovieRequest(title);

        const value = await fetchURL(url)
            .catch(reason => Promise.reject(reason));

        if (value.status === 200) {
            return await value.text().then(textValue => {
                let $ = cheerio.load(textValue);
                return (new Streamers.GOMO.streamer).resolveStreamURL($("iframe").first().attr("src"));
            });
        } else {
            return Promise.reject("Movies.co returned with a statuscode != 200");
        }
    }

    async provideTV(title: string, theMovieDBId: number, season: number, episode: number): Promise<{ url: string; init: HeadersInit, needsFurtherExtraction: boolean }> {
        const url: string = formatTvRequest(title, season, episode);

        const value = await fetchURL(url)
            .catch(reason => Promise.reject(reason));

        if (value.status === 200) {
            return await value.text().then(textValue => {
                let $ = cheerio.load(textValue);
                return (new Streamers.GOMO.streamer).resolveStreamURL($(".playerLock > iframe").first().attr("src"));
            });
        }
        return Promise.reject("Movies.co returned with a statuscode != 200");
    }

    async checkMovieAvailability(title: string, theMovieDBId: number): Promise<Boolean> {
        const url: string = formatMovieRequest(title);

        const value: Response = await fetchURL(url)
            .catch(reason => Promise.reject(reason));

        if (value.status === 200) {
            return await value.text().then(textValue => {
                let $ = cheerio.load(textValue);
                return $("iframe").first().attr("src") !== undefined;
            });
        }
        return Promise.reject("Movies.co returned with a statuscode != 200");
    }

    async checkTVAvailability(title: string, theMovieDBId: number, season: number, episode: number): Promise<Boolean> {
        const url: string = formatTvRequest(title, season, episode);

        const value = await fetchURL(url)
            .catch(reason => Promise.reject(reason));

        if (value.status === 200) {
            return await value.text().then(textValue => {
                let $ = cheerio.load(textValue);
                return $(".playerLock > iframe").first().attr("src") !== undefined;
            });
        }
        return false;
    }
}


