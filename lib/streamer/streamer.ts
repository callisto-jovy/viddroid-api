export abstract class Streamer {

    protected name: string;

    protected constructor(name: string) {
        this.name = name;
    }

    abstract resolveStreamURL(referral?: string, init?: HeadersInit): Promise<{ url: string, init: HeadersInit, needsFurtherExtraction: boolean}>;

    get streamerName(): string {
        return this.name;
    }
}