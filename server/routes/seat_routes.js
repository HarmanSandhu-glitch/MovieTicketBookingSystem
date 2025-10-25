import { getSeat, getHallSeats, getSeatStatus, createSeatsForHall } from "../controllers/seat_Controllers/index.js";

import express from 'express';
const router = express.Router();

// Get all seats for a hall
router.get('/hall/:hallId', getHallSeats);

// Create seats for a hall
router.post('/hall/:hallId/create', createSeatsForHall);

// Get seat status for a specific show
router.get('/:seatId/:showId', getSeatStatus);

// Get seat by ID (legacy route)
router.get('/:id', getSeat);

export default router;