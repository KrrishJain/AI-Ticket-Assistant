import express from 'express'
import { getUser, login, logout, signup, updateUser } from '../controller/user.controller.js'
import { authenticate } from '../middlewares/auth.js'

const router = express.Router()

router.post("/update-user", authenticate,  updateUser)
router.get("/get-user", authenticate,  getUser)

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

export default router 