import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.js';
import { verifyUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/logout', logout);
router.post('/login', login);
router.post('/signup', signup);
router.put('/update-profile', verifyUser, updateProfile);
router.get('/check', verifyUser, checkAuth);

export default router;