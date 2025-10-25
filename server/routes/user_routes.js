import express from 'express';
import { isAuth } from '../middlewares/authMiddleware.js';
import { 
  signIn, 
  signUp, 
  updateUser 
} from '../controllers/user_controllers/index.js';

const router = express.Router();

// Authentication routes
router.post('/signin', signIn);
router.post('/signup', signUp);

// User profile routes
router.put('/profile/:id', isAuth, updateUser);

export default router;