import { generateTicket, getAllTickets, getUserTickets, updateTicketStatus } from "../controllers/ticket_controllers/index.js";

import express from 'express';
const router = express.Router();

router.post('/generate', generateTicket);
router.get('/all', getAllTickets);
router.get('/user/:userId', getUserTickets);
router.put('/:id/update-status', updateTicketStatus);

export default router;