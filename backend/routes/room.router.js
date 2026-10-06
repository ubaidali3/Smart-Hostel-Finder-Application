import express from 'express'
import { authorize, protect } from '../middleware/auth.middlerware.js'
import { createRoom, deleteRoom, getAllRooms, getRoomById, updateRoom } from '../controller/room.controller.js'
import upload from '../middleware/upload.middleware.js'


const RoomRouter=express.Router()


RoomRouter.post('/',protect,authorize('warden'),upload.array('images',5), createRoom)
RoomRouter.get('/',getAllRooms)
RoomRouter.get('/:id',getRoomById)
RoomRouter.put('/:id',protect,authorize('warden'),upload.array('images', 5),updateRoom)
RoomRouter.delete('/:id',protect,authorize('warden'),deleteRoom)
export default RoomRouter