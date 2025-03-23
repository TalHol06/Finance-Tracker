import express from 'express';
import db from './connection/connection.js';
import routes from './routes/app.js';

await db();

const port = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(port, () => console.log(`Server running on port ${port}!`));