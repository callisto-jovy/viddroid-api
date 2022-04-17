import {Streamer} from "../streamer";
import fetch from "cross-fetch";
import {getUserAgent} from "../../util/wrapper";
import {atob} from "buffer";

export class SuperStream extends Streamer {

    constructor() {
        super("superstream");
    }

    windowSrcRegex: RegExp = /src="'\+window.atob\('(.*?)'\)/g;

    async resolveStreamURL(referral?: string, init?: HeadersInit): Promise<{ url: string; init: HeadersInit, needsFurtherExtraction: boolean }> {
        if (!referral) {
            return Promise.reject("Referral is non-existent");
        }

        init ??= {"User-Agent": getUserAgent()};

        const firstResponse = await fetch(referral, {
            headers: init
        });

        const fastURL: string = await firstResponse.text().then(value => {
            const windowSrcMatch = this.windowSrcRegex.exec(value);
            if (windowSrcMatch != null) {
                return atob(windowSrcMatch[1]);
            }
            return Promise.reject("Window src match returned with null");
        });

        return Promise.resolve({init: {"Referrer": referral}, url: fastURL, needsFurtherExtraction: true});
    }

}