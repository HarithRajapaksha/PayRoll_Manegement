import express from 'express';
import authorizeRoles from '../Middlewares/roleMiddleware.js';
import verifyToken from '../Middlewares/authMiddleware.js';
import LeaveDataModel from '../Model/LeaveDataModel.js'
import UserModel from '../Model/UserModel.js'


const router = express.Router();

router.get('/getHolidayDetails/:id',verifyToken,async (req, res) => {

    
  const { id } = req.params;
   console.log("Holiday details request received",id);
   
  // work out current‑month window (same as before)
  const now          = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  try {
    // pull every overlapping leave record
    const leaveDetails = await LeaveDataModel.find({
      LeaveHolderId: id,
      LeaveStartDate: { $lte: endOfMonth },
      LeaveEndDate:   { $gte: startOfMonth }
    });

    if (!leaveDetails.length) {
      return res.status(404).json({ message: "No holiday details found for this user this month." });
    }

    // ► SUM NumOfDay across all records
    const totalDays = leaveDetails.reduce(
      (sum, rec) => sum + (Number(rec.NumOfDay) || 0),0
    );

    res.status(200).json({
      message: "Holiday details for the current month retrieved successfully",
      totalDays,           
      recordCount: leaveDetails.length,
      data: leaveDetails   
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving holiday details",
      error: error.message
    });
  }
});


//get homepage for employee details
router.get('/getEmployeeDetails/:id', verifyToken, async (req, res) => {
   const { id } = req.params;

    try {
        const user = await UserModel.findById(id); 
    
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }
    
        res.status(200).json({
        message: "Employee details retrieved successfully",
        BasicSalary: user.basicSal,
        name: user.name,
        role:user.role,
        EmpId: user.CorrectuserId,
        dateOfJoin: user.dateOfJoin
        });


    } catch (error) {
        res.status(500).json({
            message: "Error retrieving employee details",
            error: error.message
        });
    }
});




export default router; 
