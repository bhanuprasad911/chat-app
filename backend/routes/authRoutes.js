import express from 'express';
import { login, signup, logout, onboardUser } from '../controllers/authController.js';
import protectRoute from '../middlewares/authMiddleware.js';
const authRouter = express.Router();
authRouter.post('/login', login)
authRouter.post('/signup', signup)

authRouter.post('/logout', logout)

authRouter.post('/onboard', protectRoute, onboardUser)

authRouter.get('/me', protectRoute, (req, res) => {
    res.status(200).json({user:req.user, success:true})
})



export default authRouter