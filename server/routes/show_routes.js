import express from 'express';
import { isAuth, isAdmin } from "../middlewares/authMiddleware.js";
import { 
  createShow, 
  deleteShow, 
  getAllShows, 
  getShowById, 
  updateShow 
} from "../controllers/show_controllers/index.js";

const router = express.Router();

// Static routes first
router.post('/create', isAuth, isAdmin, createShow);
router.get('/all', getAllShows);

// Dynamic routes after
router.get('/:id', getShowById);
router.put('/:id/update', isAuth, isAdmin, updateShow);
router.delete('/:id/delete', isAuth, isAdmin, deleteShow);

export default router;