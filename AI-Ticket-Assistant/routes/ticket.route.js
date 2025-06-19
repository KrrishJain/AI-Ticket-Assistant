import express from 'express'
import { authenticate } from '../middlewares/auth.js'
import { createTicket, getAssignedTickets, getTicket, getTickets } from '../controller/ticket.controller.js'

const router = express.Router()

router.get("/", authenticate, getTickets)
router.get("/assinged-tickets", authenticate, getAssignedTickets)
router.get("/:id", authenticate, getTicket)
router.post("/", authenticate, createTicket)

export default router