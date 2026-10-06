import express from 'express'
import { createApplication, getMyroom, getWardenApplications, myApplication, updateApplicationStatus } from '../controller/application.controller.js'
import { authorize, protect } from '../middleware/auth.middlerware.js'

const applicationRouter=express.Router()

applicationRouter.post('/',protect,authorize('student'),createApplication)


applicationRouter.get('/my',protect,authorize('student'),myApplication)


applicationRouter.get('/warden',protect,authorize('warden'),getWardenApplications)


applicationRouter.put('/:id/status',protect,authorize('warden'),updateApplicationStatus)


applicationRouter.get('/my-room',protect,authorize('student'),getMyroom)


export default applicationRouter