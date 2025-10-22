import { createHall, deleteHall, getAllHalls, getHallById, getHallShows, updateHall } from "../controllers/hall_controllers/index.js";

import express from 'express';
const router = express.Router();

router.post('/create', createHall);
router.get('/all', getAllHalls);
router.get('/:id', getHallById);
router.get('/:id/shows', getHallShows);
router.put('/:id/update', updateHall);
router.delete('/:id/delete', deleteHall);


export default router;