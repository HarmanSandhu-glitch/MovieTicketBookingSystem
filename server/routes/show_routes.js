import { createShow, deleteShow, getAllShows, getShowById, updateShow } from "../controllers/show_controllers/index.js";
import express from 'express';
const router = express.Router();

router.post('/create', createShow);
router.get('/all', getAllShows);
router.get('/:id', getShowById);
router.put('/:id/update', updateShow);
router.delete('/:id/delete', deleteShow);

export default router;