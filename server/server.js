import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user_routes.js';
import hallRoutes from './routes/hall_routes.js';
import showRoutes from './routes/show_routes.js';
import ticketRoutes from './routes/ticket_routes.js';
import connectDB from './configs/db.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
console.log('PORT:', PORT);
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

connectDB();


app.get('/', (req, res) => {
    res.send('😉');
});
app.use('/api/users', userRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/tickets', ticketRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});