import mongoose from 'mongoose'
const connectDb=async ()=>{
  try {
    mongoose.connection.on('connected',()=>{
      console.log('DB connected')
    })
    const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/HostelHub`)
     console.log(`MongoDB connected: ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log(error)
  }
}

export default connectDb