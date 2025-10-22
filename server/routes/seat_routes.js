import { getSeat } from "../controllers/seat_Controllers/index.js";

import express from 'express';
const router = express.Router();
router.get('/:id', getSeat);

export default router;