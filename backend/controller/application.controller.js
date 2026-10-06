import Application from '../models/application.model.js'
import Hosetl from '../models/hostel.model.js'
import Room from '../models/room.model.js'


const createApplication = async (req, res) => {
  try {
    const { hostel, room, message } = req.body

    // 1. Check hostel exists
    const existHostel = await Hosetl.findById(hostel)

    if (!existHostel) {
      return res.status(404).json({
        success: false,
        message: 'This hostel does not exist'
      })
    }

    // 2. Check room exists
    const existRoom = await Room.findById(room)

    if (!existRoom) {
      return res.status(404).json({
        success: false,
        message: 'This room does not exist'
      })
    }

    // 3. Check room belongs to selected hostel
    if (existRoom.hostel.toString() !== existHostel._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'This room does not belong to this hostel'
      })
    }

    // 4. Check room is available
    if (existRoom.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'This room is not available'
      })
    }

    // 5. Check student already applied
    const existApplication = await Application.findOne({
      student: req.user._id,
      hostel,
      room
    })

    if (existApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this room'
      })
    }

    // 6. Create application
    const application = await Application.create({
      student: req.user._id,
      hostel,
      room,
      message
    })

    // 7. Success response
    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    })

  } catch (error) {
    console.error('Create Application Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

const myApplication=async(req,res)=>{
  try {
    const application=await Application.find({
      student:req.user._id
    })
    if(application.length===0){
       return res.status(400).json({
        success: false,
        message: 'The user was not found'
      })
    }
    return res.status(200).json({
      success:true,
      message:'Application fetched successfully',
      application
    })
  } catch (error) {
    console.error('fetched My Application Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

const getWardenApplications = async (req, res) => {
  try {

    // 1. Logged-in warden ke hostels find karo
    const hostels = await Hosetl.find({
      owner: req.user._id
    })

    if (hostels.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hostel found for this warden'
      })
    }

    // 2. Hostels ki IDs nikalo
    const hostelIds = hostels.map(hostel => hostel._id)

    // 3. In hostels ki applications find karo
    const applications = await Application.find({
      hostel: { $in: hostelIds }
    })

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No applications found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Applications fetched successfully',
      applications
    })

  } catch (error) {

    console.error('Fetched Warden Applications Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}


const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    // 1. Check status
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be approved or rejected",
      });
    }

    // 2. Find application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // 3. Check application status
    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Application is already ${application.status}`,
      });
    }

    // 4. Find hostel
    const hostel = await Hosetl.findById(application.hostel);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    // 5. Check hostel ownership
    if (hostel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to manage this application",
      });
    }

    // 6. If approving, check room
    if (status === "approved") {
      const room = await Room.findById(application.room);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }

      // Check room availability
      if (room.status !== "available") {
        return res.status(400).json({
          success: false,
          message: "This room is not available",
        });
      }

      // Check capacity
      if (room.occupied >= room.capacity) {
        return res.status(400).json({
          success: false,
          message: "Room is already full",
        });
      }

      // Increase occupied students
      room.occupied += 1;

      // If capacity reached, make room full
      if (room.occupied >= room.capacity) {
        room.status = "full";
      }

      await room.save();
    }

    // 7. Update application status
    application.status = status;

    await application.save();

    // 8. Send response
    return res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      application,
    });

  } catch (error) {
    console.error("Update Application Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getMyroom=async (req,res)=>{
  try {
    const application =await Application.findOne({
      student:req.user._id,
      status:'approved'
    })

    //// check approved application
    if(!application){
      return res.status(404).json({
        success:false,
        message:"You don't have an approved room "
      })
    }
    //// find room 
    const room=await Room.findById(application.room)
     if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      })
    }
     // Find hostel
    const hostel=await Hosetl.findById(application.hostel)
       if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found"
      })
    }

    return res.status(200).json({
      success:true,
      message: "Your room details fetched successfully",
      room,
      hostel
    })
  } catch (error) {
     console.error("get My room Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}


export { createApplication ,myApplication,getWardenApplications,updateApplicationStatus,
  getMyroom
}