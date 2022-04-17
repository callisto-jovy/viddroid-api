import express from 'express';

const app = express();
const movieAPI = require('./v1/movie_api_route.ts');
const streamerAPI = require('./v1/stream_api_route');
const tvAPI = require('./v1/tv_api_route');

app.use('/api/v1/movie', movieAPI);
app.use('/api/v1/streamer', streamerAPI);
app.use('/api/v1/tv', tvAPI);


app.get('/', (req, res) => {
    res.json({
        error: 'Invalid path',
        payload: ''
    })
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Express API running on http://localhost:${PORT}`);
});