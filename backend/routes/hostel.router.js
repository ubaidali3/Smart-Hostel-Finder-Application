import express from 'express'
import { authorize, protect } from '../middleware/auth.middlerware.js'
import { createHosetl, deleteHostel, getAllHosetls, getHostelById, searchHostels, updateHostel } from '../controller/hostel.controller.js'
import upload from '../middleware/upload.middleware.js'

const hostelRouter=express.Router()


hostelRouter.post('/',protect,authorize('warden'),upload.array('images', 5),createHosetl)
hostelRouter.get('/',getAllHosetls)
hostelRouter.get('/search',searchHostels)
hostelRouter.get('/:id',getHostelById)
hostelRouter.put('/:id',protect,authorize('warden'),upload.array('images', 5),updateHostel)
hostelRouter.delete('/:id',protect,authorize('warden'),deleteHostel)


export default hostelRouter