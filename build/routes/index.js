"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const movieAPI = require('./v1/movie_api_route.ts');
const streamerAPI = require('./v1/stream_api_route');
app.use('/api/movie', movieAPI);
app.use('/api/streamer', streamerAPI);
app.get('/', (req, res) => {
    res.json({
        error: 'Invalid path',
        payload: ''
    });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Express API running on http://localhost:${PORT}`);
});
