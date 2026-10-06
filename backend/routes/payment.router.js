import express from 'express'
import { authorize, protect } from '../middleware/auth.middlerware.js'
import { confirmPayment, createPayment, getWardenPayment } from '../controller/payment.controller.js'



const PaymentRouter=express.Router()

PaymentRouter.post('/',protect,authorize('student'),createPayment)
PaymentRouter.get('/warden',protect,authorize('warden'),getWardenPayment)
PaymentRouter.put('/:id/confirm',protect,authorize('warden'),confirmPayment)



export default PaymentRouter