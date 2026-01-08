import express from 'express';
import cors from 'cors';
import {FRONTEND_URL, PORT} from './utils/config';
import morgan from 'morgan';

const app = express();
app.use(express.json());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(cors({origin: FRONTEND_URL}));

app.get('/ping', (_req, res) => {
    res.send('pong');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});