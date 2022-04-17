import {fetchURL, getUserAgent, sourceRegex} from "../../util/wrapper";
import fetch from "cross-fetch";
import cheerio from "cheerio";
import {detect, unpack} from "unpacker";
import "../streamer";
import {Streamer} from "../streamer";


const tcExpr: RegExp = /var tc = '(.+)';/;


const tokenRegex: RegExp = /"_token": "(.+)"/g;


const functionRegex: RegExp = /function (.*? { (.*)+})/gm;


const sliceRegex: RegExp = /slice\s*\(\s*(\d)\s*,\s*(\d+)\)/g;


const rndNumRegex: RegExp = /\+ "(\d+)"\s*\+\s*"(\d+)"/g;


const decodingAPI: string = "https://gomo.to/decoding_v3.php";


export class Gomo extends Streamer {

    constructor() {
        super("gomo");
    }

    async resolveStreamURL(referral?: string, init?: HeadersInit): Promise<{ url: string, init: HeadersInit }> {
        if (!referral) {
            return Promise.reject("referral is empty");
        }

        init ??= {"User-Agent": getUserAgent()};

        const response = await fetchURL(referral, init);

        if (response.status === 200) {
            const textValue: string = await response.text();

            //Reset regular expressions
            tcExpr.lastIndex = 0;
            tokenRegex.lastIndex = 0;
            functionRegex.lastIndex = 0;
            sliceRegex.lastIndex = 0;
            rndNumRegex.lastIndex = 0;

            const tcMatch = tcExpr.exec(textValue);
            const tokenMatch = tokenRegex.exec(textValue);
            const funcMatch = functionRegex.exec(textValue);

            if (tcMatch == null) {
                return Promise.reject("TC match is null.");
            } else if (tokenMatch == null) {
                console.log(textValue)
                return Promise.reject("Token match is null." + textValue);
            } else if (funcMatch == null) {
                return Promise.reject("Function match is null.");
            }

            const tcGroup: string = tcMatch[1];
            const tokenGroup: string = tokenMatch[0];
            const sliceMatch = sliceRegex.exec(textValue);
            const rndNumberMatch = rndNumRegex.exec(textValue);
            if (sliceMatch != null) {
                const sliceStart: string = sliceMatch[1];
                const sliceEnd: string = sliceMatch[2];

                let xToken: string = tcGroup
                    .substring(parseInt(sliceStart), parseInt(sliceEnd))
                    .split('')
                    .reverse()
                    .join('');

                if (rndNumberMatch != null) {
                    xToken += rndNumberMatch.slice(1).join('');
                }

                const decodingAPIResponse = await fetch(decodingAPI, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "User-Agent": getUserAgent(),
                        "x-token": xToken,
                        Referrer: referral,
                    },
                    body: `tokenCode=${tcGroup}&_token=${tokenGroup}`
                });

                if (decodingAPIResponse.status === 200) {
                    const json: [] = await decodingAPIResponse.json();

                    for (let i = 0; i < json.length; i++) {
                        const redirect: string = json[i];

                        if (redirect.startsWith('https://gomo')) {
                            const redirectResponse = await fetch(redirect, {headers: init});

                            if (redirectResponse.status === 200) {
                                const redirectResponseText: string = await redirectResponse.text();

                                const $ = cheerio.load(redirectResponseText);

                                const packed: string | null = $("script").filter((i, el) => $(el).html() == null ? false : $(el).html()!.startsWith('eval'))
                                    .html();

                                if (packed == null) {
                                    return Promise.reject("No packed js found");
                                }

                                if (detect(packed)) {
                                    const unpacked: string = unpack(packed);

                                    const sourceMatch = sourceRegex.exec(unpacked);

                                    if (sourceMatch != null) {
                                        return {url: sourceMatch[0], init: {"Referrer": redirect}};
                                    }
                                } else {
                                    return Promise.reject("Packer did not find packed js");
                                }
                            } else {
                                return Promise.reject(`Redirect rejected request with SC ${redirectResponse.status}`);
                            }
                        }
                    }
                } else {
                    return Promise.reject(`decoding api rejected the request with SC ${decodingAPIResponse.status}`);
                }
            } else {
                return Promise.reject("Slice match is null :" + textValue);
            }
        } else {
            return Promise.reject(`referral rejected the request with SC ${response.status}`);
        }
        return Promise.reject("Case failed");
    }
}
