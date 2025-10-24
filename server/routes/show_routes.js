import { createShow, deleteShow, getAllShows, getShowById, updateShow } from "../controllers/show_controllers/index.js";
import express from 'express';
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post('/create', isAuth, isAdmin, createShow);
router.get('/all', getAllShows);
router.get('/:id', getShowById);
router.put('/:id/update', isAuth, isAdmin, updateShow);
router.delete('/:id/delete', isAuth, isAdmin, deleteShow);

export default router;