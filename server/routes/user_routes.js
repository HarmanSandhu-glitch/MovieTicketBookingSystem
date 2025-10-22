import express from 'express';
import User from '../models/user_model.js';
import { signIn, signUp, updateUser } from '../controllers/user_controllers/index.js';

const router = express.Router();

// sign in
router.post('/signin', signIn);
// sign up
router.post('/signup', signUp);
// update profile
router.put('/profile/:id', updateUser);

export default router;