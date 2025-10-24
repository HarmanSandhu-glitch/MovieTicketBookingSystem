import { generateTicket, getAllTickets, getUserTickets, updateTicketStatus } from "../controllers/ticket_controllers/index.js";

import express from 'express';
import { isAuth } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post('/generate', isAuth, generateTicket);
router.get('/all', isAuth, getAllTickets);
router.get('/user/:userId', isAuth, getUserTickets);
router.put('/:id/update-status', isAuth, updateTicketStatus);

export default router;