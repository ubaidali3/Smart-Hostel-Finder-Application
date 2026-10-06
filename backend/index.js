import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './config/mongoDb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/user.router.js'
import hostelRouter from './routes/hostel.router.js'
import RoomRouter from './routes/room.router.js'
import applicationRouter from './routes/application.router.js'
import FeeRouter from './routes/fee.router.js'
import PaymentRouter from './routes/payment.router.js'
import noticeRouter from './routes/notice.router.js'
import complaintRouter from './routes/complaint.router.js'


const app=express()
const port =process.env.PORT

connectDb()
connectCloudinary()
app.use(express.json())
// app.use(cors())
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smart-hostel-finder-application-eo9.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use('/api/user',userRouter)
app.use('/api/hostel',hostelRouter)
app.use('/api/rooms',RoomRouter)
app.use('/api/applications',applicationRouter)
app.use('/api/fees',FeeRouter)
app.use('/api/payments',PaymentRouter)
app.use('/api/notices',noticeRouter)
app.use('/api/complaints',complaintRouter)
app.get('/',(req,res)=>{
   res.send('Api working')
})
app.listen(port,()=>{
  console.log(`server are running on this http://localhost:${port}`)
})
