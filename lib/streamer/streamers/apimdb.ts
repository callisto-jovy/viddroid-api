import {Streamer} from "../streamer";
import cheerio, {Cheerio, Element} from "cheerio";
import fetch from "cross-fetch";


export class Apimdb extends Streamer {

    constructor() {
        super("apimdb");
    }

    async resolveStreamURL(referral?: string, init?: HeadersInit): Promise<{ url: string; init: HeadersInit }> {
        if (!referral) {
            return Promise.reject("Referral is empty");
        }

        const firstStageResponse: Response = await fetch(referral, {
            headers: init
        }).catch(reason => Promise.reject(reason));

        if (firstStageResponse.status === 200) {
            const $ = cheerio.load(await firstStageResponse.text().catch(reason => Promise.reject(reason)));

            //All servers
            const servers: Cheerio<Element> = $(".server");
            console.log(firstStageResponse.url)
            console.log($.html())

            for (let server of servers) {
                const dataSrc: string = server.attribs["data-src"];
                const text: string = server.name;

                return {url: "eeee", init: {"data-src": dataSrc, "text": text}};
            }
            return Promise.reject("No server in the HTML were found.");
        } else {
            return Promise.reject(`APIMDB first stage (initial document) returned with status code ${firstStageResponse.status}. Tried to access: ${referral}...`);
        }
    }

}