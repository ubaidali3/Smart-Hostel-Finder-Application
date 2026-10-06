import express from 'express'
import { authorize, protect } from '../middleware/auth.middlerware.js'
import { createFee, getMyFee } from '../controller/fee.controller.js'


const FeeRouter=express.Router()


FeeRouter.post('/warden',protect,authorize('warden'),createFee)
FeeRouter.get('/my',protect,authorize('student'),getMyFee)


export default FeeRouter
