export abstract class Provider {

    protected name: string;

    protected constructor(name: string) {
        this.name = name;
    }

    abstract provideMovie(title: string, theMovieDBId: number): Promise<{ url: string, init: HeadersInit }>;

    abstract provideTV(title: string, theMovieDBId: number, season: number, episode: number): Promise<{ url: string, init: HeadersInit }>;

    abstract checkMovieAvailability(title: string, theMovieDBId: number): Promise<Boolean>;

    abstract checkTVAvailability(title: string, theMovieDBId: number, season: number, episode: number): Promise<Boolean>;

    get providerName(): string {
        return this.name;
    }
}
