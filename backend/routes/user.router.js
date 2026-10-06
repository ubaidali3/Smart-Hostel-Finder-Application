import {getProfile, loginUser, regitserUser} from '../controller/user.controller.js'

import express from 'express'
import { protect } from '../middleware/auth.middlerware.js'

const userRouter=express.Router()

userRouter.post('/register',regitserUser)
userRouter.post('/login',loginUser)
userRouter.get('/profile',protect,getProfile)

export default userRouter