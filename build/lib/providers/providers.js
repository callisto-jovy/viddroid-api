"use strict";
class Providers {
    getResovedURL(title, theMovieDBId, season, episode) {
        if (season == null && episode == null) { //Default to movie
        }
        else { //TV show is requested
        }
        return Promise.reject('No provider was found');
    }
}
module.exports = new Providers();
