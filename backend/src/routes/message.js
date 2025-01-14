import express from 'express';
import {verifyUser} from '../middleware/auth.js';
import {getContacts,getContactMessage,sendMessage} from '../controllers/message.js';

const router = express.Router();

router.get('/users', verifyUser, getContacts);
router.get('/:contactid', verifyUser, getContactMessage);
router.post('/send/:contactid', verifyUser, sendMessage);

export default router;