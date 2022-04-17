import UserAgent from "user-agents";
import fetch from "cross-fetch";

export function getUserAgent(): string {
    return new UserAgent().random().toString();
}

export function fetchURL(url: string, headers?: HeadersInit): Promise<Response> {
    headers ??= {"User-Agent": getUserAgent()};
    return fetch(url, {
        headers: headers
    });
}

export const sourceRegex: RegExp = /(?<=sources:\[{file:")[^"]+/g;