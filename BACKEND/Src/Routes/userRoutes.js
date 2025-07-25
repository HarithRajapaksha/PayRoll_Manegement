const express=require('express');
const router=express.Router();
const authorizeRoles=require("../Middlewares/roleMiddleware");
const verifyToken=require("../Middlewares/authMiddleware");
const User = require('../Model/UserModel');
const LeaveData= require('../Model/LeaveDataModel');
const MiddleSal= require('../Model/MiddleSalModel');
const Attendance=require('../Model/AttendenceData');
const EPFModel=require('../Model/EPFModel');
const HalfDay=require('../Model/HalfDayModel');
const Allowance=require('../Model/Allowancemodel');
const Payments=require('../Model/PaymentsModel');
const allowance = require('../Model/Allowancemodel');
const LastEmp=require("../Model/LastEmpSavemodel")



router.get('/admin/:userId', verifyToken, authorizeRoles( 'Admin', 'Maneger', 'Headchef', 'Subchef', 'Supervisior', 'Waiter', 'Helper'), async (req, res) => {
  const userId = req.params.userId;
  console.log("User Id is : ", userId);
  console.log("called this one");
  try {
    const FindUser = await User.findOne({ CorrectuserId: userId }).lean();
    if (!FindUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User found', FindUser });
    console.log("User found: ", FindUser);
  } catch (error) {
    res.status(500).json({ message: 'Error finding user' });
    console.log("Error is : ", error);
  }
});



router.get('/leaveRe/:userId', verifyToken, authorizeRoles( 'Admin', 'Maneger', 'Headchef', 'Subchef', 'Supervisior', 'Waiter', 'Helper'), async (req, res) => {
  const userId = req.params.userId;
  console.log("User Id is : ", userId);
  console.log("called this one");
  try {
    const FindUser = await User.findOne({ _id: userId }).lean();
    if (!FindUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User found', FindUser });
    console.log("User found: ", FindUser);
  } catch (error) {
    res.status(500).json({ message: 'Error finding user' });
    console.log("Error is : ", error);
  }
});


//Only manager can access this route
router.get('/manager',verifyToken,authorizeRoles('maneger'),(req,res)=>{
    res.send('Welcome Manager');
});

//All users can access this route
router.get('/allUsers/:id',verifyToken,authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{

  const id=req.params.id;
  console.log("User Id is : ",id);

  try {
    const FindUser= await User.findById(id).lean();
    res.status(200).json({message:'User found',FindUser});
    console.log("User finded ",FindUser);
   } catch (error) {
     res.status(500).json({message:'User not found'});
     console.log("Error is : ",error);
   }
});



//Get all users data
router.get('/allUsersData',verifyToken,authorizeRoles('Admin','Maneger','Admin', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{


  try {
    const FindUser= await User.find().lean();
    res.status(200).json({message:'User found',FindUser});
    console.log("User finded ",FindUser);
   } catch (error) {
     res.status(500).json({message:'User not found'});
     console.log("Error is : ",error);
   }
});



//All users can access this route
router.post('/addEmpData',verifyToken,authorizeRoles('Maneger','Admin', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{
   const {userId,role,aSal,lDays}=req.body;

    const newUser=new LeaveData({
        userId,
        role,
        aSal,
        lDays
    });

    try {
        const user=await newUser.save();
        res.status(200).json({message:'User added',user});
        console.log("User added ",user);
    } catch (error) {
        res.status(500).json({message:'User not added'});
        console.log("Error is : ",error);
    }
  
});


//All users can access this route
router.post('/addLeave',verifyToken,authorizeRoles('Maneger','Admin', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{
  const {LeaveHolderId, LeaveStartDate,
    LeaveEndDate,
    NumOfDay ,
    Name,
    Role,
    Reason,Status, CorrectuserId}=req.body;

   const newLeave=new LeaveData({
    LeaveHolderId,
    LeaveStartDate:LeaveStartDate,
    LeaveEndDate,
    NumOfDay ,
    Name,
    Role,
    Reason,
    Status,
    CorrectuserId
   });

   console.log("Leave data is : ",newLeave);

   try {
       const leave=await newLeave.save();
       res.status(200).json({message:'Leave added',leave });
       console.log("Leave added ",leave);
   } catch (error) {
       res.status(500).json({message:'Leave not added'});
       console.log("leave added error: ",error);
   }
 
});


//All users can access this route
router.post('/salRequest',verifyToken,authorizeRoles('Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{
  const {Uid,Name,Role,Salary}=req.body;

   const newUser=new MiddleSal({ 
      Uid,
      Name,
      Role,
      Salary
   });

   try {
       const user=await newUser.save();
       res.status(200).json({message:'MiddleSal added',user});
       console.log("Middle Salary Added",user);
   } catch (error) {
       res.status(500).json({message:'Middle Salary Not Added'});
       console.log("Middle Salary Not Added",error);
   }
 
});


router.get('/HolidayData', verifyToken, authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'), async (req, res) => {
  try {
    
    const HolidayData = await LeaveData.find().sort({ LeaveStartDate: -1 });
    res.status(200).json(HolidayData);
    console.log("Holiday data found:", HolidayData);
  } catch (error) {
    res.status(500).json({ message: 'Holiday data not found' });
    console.log("Holiday data not found", error);
  }
});


router.get('/getHolidayData/:id',verifyToken,authorizeRoles('Admin', 'Maneger', 'Headchef', 'Subchef', 'Supervisior', 'Waiter', 'Helper'),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Get current month range
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      // Fetch leaves for that user in the current month
      const leaveData = await LeaveData.find({
        LeaveHolderId: id,
        LeaveStartDate: { $gte: startOfMonth, $lte: endOfMonth },status:"true"
      }).select('NumOfDay');

      // Sum up the total leave days for this month
      const totalDays = leaveData.reduce((sum, leave) => sum + (leave.NumOfDay || 0), 0);

      const isLessThanSeven = totalDays < 7;

      res.status(200).json({ allowed: isLessThanSeven, totalDays });
    } catch (err) {
      console.error("Error fetching leave data:", err);
      res.status(500).json({ message: 'Holiday data not found' });
    }
  }
);


router.put('/updateLeave', verifyToken, authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'), async (req, res) => {
  try {
    
    const { id, status,declineReason} = req.body;

    console.log("Leave Holder Id is: ", id);
    console.log("Status is: ", status);
    console.log("Decline Reason is: ", declineReason);

    const HolidayUpdate = await LeaveData.findOneAndUpdate(
      { _id: id }, 
      { $set: { status: status,declineReason:declineReason} }, 
      { new: true } 
    );

    if (!HolidayUpdate) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    res.status(200).json({ message: 'Leave updated successfully', HolidayUpdate });
    console.log("Leave updated:", HolidayUpdate);

  } catch (err) {
    res.status(500).json({ message: 'Leave not updated' });
    console.log("Leave not updated", err);
  }
});

router.get('/AllLeaveData', verifyToken, authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'), async (req, res) => {
  try {
    
    const MSalData = await MiddleSal.find();
    res.status(200).json(MSalData);
    console.log("Midle salary data found:", MSalData);
  } catch (error) {
    res.status(500).json({ message: 'Leave data not found' });
    console.log("Midle salary data not found", error);
  }
});

router.post('/AddAdditionalSal', verifyToken, authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'), async (req, res) => {
  const {Uid,Name,Role,Salary}=req.body;

   const newUser=new MiddleSal({ 
      Uid,
      Name,
      Role,
      Salary,
      Status:'Non',
      Reason:''
   });

   try {
       const user=await newUser.save();
       res.status(200).json({message:'MiddleSal added',user});
       console.log("Middle Salary Added",user);
   } catch (error) {
       res.status(500).json({message:'Middle Salary Not Added'});
       console.log("Middle Salary Not Added",error);
   }
});

//Status and Reason Update route in Middle Salary
router.put('/updateMiddleSal', verifyToken, authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'), async (req, res) => {
  try {
    
    const { id, Status,Reason} = req.body;

    console.log("User Id is: ", id);
    console.log("Status is: ", Status);
    console.log("Reason is: ", Reason);

    const SalUpdate = await MiddleSal.findOneAndUpdate(
      { _id: id }, 
      { $set: { Status: Status,Reason:Reason} }, 
      { new: true } 
    );

    if (!SalUpdate) {
      return res.status(404).json({ message: 'Salary not found' });
    }

    res.status(200).json({ message: 'Salary updated successfully', SalUpdate });
    console.log("Salary updated:", SalUpdate);

  } catch (err) {
    res.status(500).json({ message: 'Salary not updated' });
    console.log("Salary not updated", err);
  }
});


//get user data by barcode 
router.get('/getUser/:barcode',verifyToken,authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{

  const barcode=req.params.barcode;
  console.log("Barcode is : ",barcode);

  try {
    const FindUser= await User.findOne({barcode}).lean();
    res.status(200).json({message:'User found',FindUser});
   } catch (error) {
     res.status(500).json({message:'User not found'});
     console.log("Error is : ",error);
   }
});


//Add the attendence data
router.put('/updateUserAttendence',verifyToken,authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{  
  const {userId,name,jobrole,barcode,date,time,status}=req.body;

  try {
    const user=await User.findOneAndUpdate({_id:userId},{name,jobrole,barcode,date,time,status},{new:true});
    if(!user){
      return res.status(404).json({message:'User not found for update'});
    }
    res.status(200).json({message:'User updated',user});
    console.log("User updated ",user);
  } catch (error) {
    res.status(500).json({message:'User not updated'});
    console.log("Error is : ",error);
  }
});

router.post('/addUserAttendence', verifyToken, authorizeRoles('Admin', 'Maneger', 'Headchef', 'Subchef', 'Supervisior', 'Waiter', 'Helper'), async (req, res) => {
  const { userId, name, date, time } = req.body;

  try {
    // Check if attendance already exists for the same user and date
    const existingAttendance = await Attendance.findOne({ userId, date });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this user on this date.' });
    }

    // If not found, create new attendance
    const newAttendance = new Attendance({
      userId,
      name,
      date,
      time,
    });

    const savedAttendance = await newAttendance.save();
    res.status(200).json({ message: 'Attendance data added', user: savedAttendance });
    console.log("User added:", savedAttendance);

  } catch (error) {
    res.status(500).json({ message: 'Attendance data not added', error: error.message });
    console.log("Error is:", error);
  }
});



router.post('/addEPFData/:year/:month', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  const { UserId, EmployeeId, Employee, Employer } = req.body;
  const { year, month } = req.params;

  console.log("Called to addEPFData at", new Date().toLocaleString());
  console.log("Request Data:", { UserId, EmployeeId, Employee, Employer, year, month });

  try {
    // Validate year and month
    const parsedYear = parseInt(year);
    const parsedMonth = parseInt(month); // Frontend sends 1-12, matching MongoDB's $month
    if (isNaN(parsedYear) || isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      console.log("Validation failed: Invalid year or month");
      return res.status(400).json({ message: 'Invalid year or month' });
    }

    // Check if EPF data already exists for the EmployeeId in the specified month and year
    const existingEPF = await EPFModel.findOne({
      EmployeeId,
      $expr: {
        $and: [
          { $eq: [{ $month: "$createdAt" }, parsedMonth] },
          { $eq: [{ $year: "$createdAt" }, parsedYear] }
        ]
      }
    });

    // First submission: Create record with either Employee or Employer
    if (!existingEPF) {
      if (Employee === undefined && Employer === undefined) {
        console.log("Validation failed: At least one of Employee or Employer contribution is required");
        return res.status(400).json({ message: 'At least one of Employee or Employer contribution is required' });
      }

      const newEPFData = new EPFModel({
        UserId,
        EmployeeId,
        Employee: Employee || 0, // Set to 0 if not provided
        Employer: Employer || 0, // Set to 0 if not provided
        createdAt: new Date(parsedYear, parsedMonth - 1, 1) // Set to 1st of specified month
      });

      console.log("Creating new EPF data:", newEPFData);
      const savedEPF = await newEPFData.save();
      return res.status(200).json({ message: 'EPF data added successfully', data: savedEPF });
    }

    // Second submission: Update with the other contribution (Employee or Employer)
    // Validate UserId and EmployeeId match
    if (existingEPF.UserId !== UserId || existingEPF.EmployeeId !== EmployeeId) {
      console.log("Validation failed: UserId or EmployeeId does not match existing record");
      return res.status(403).json({ message: 'UserId or EmployeeId does not match existing record' });
    }

    // Determine which field to update based on what was provided
    const updateData = {};
    if (Employee !== undefined) {
      if (existingEPF.Employee !== 0) {
        console.log("Validation failed: Employee contribution already set");
        return res.status(400).json({ message: 'Employee contribution already set' });
      }
      updateData.Employee = Employee;
    }
    if (Employer !== undefined) {
      if (existingEPF.Employer !== 0) {
        console.log("Validation failed: Employer contribution already set");
        return res.status(400).json({ message: 'Employer contribution already set' });
      }
      updateData.Employer = Employer;
    }

    if (Object.keys(updateData).length === 0) {
      console.log("Validation failed: No valid fields provided for update");
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    const updatedEPF = await EPFModel.findOneAndUpdate(
      {
        EmployeeId,
        $expr: {
          $and: [
            { $eq: [{ $month: "$createdAt" }, parsedMonth] },
            { $eq: [{ $year: "$createdAt" }, parsedYear] }
          ]
        }
      },
      { $set: updateData },
      { new: true }
    );

    console.log("Updated EPF data:", updatedEPF);
    res.status(200).json({ message: 'EPF data updated successfully', data: updatedEPF });

  } catch (error) {
    console.error("Error processing EPF data:", error);
    res.status(500).json({ message: 'Failed to process EPF data', error: error.message });
  }
});

//Add Half Day data
router.post('/addHalfDay',verifyToken,authorizeRoles('Admin','Maneger', 'Headchef','Subchef','Supervisior','Waiter','Helper'),async(req,res)=>{
  const {userId,date,whichHalf,reason}=req.body;

  const halfDayData=new HalfDay({
      userId,
      date,
      whichHalf,
      reason
  });

  try {
      const user=await halfDayData.save();
      res.status(200).json({message:'HalfDay data added',user});
      console.log("User added ",user);
  } catch (error) {
      res.status(500).json({message:'HalfDay data not added'});
      console.log("Error is : ",error);
  }
});



router.get('/getSalData/:id/:year/:month', verifyToken, authorizeRoles('Admin', 'Maneger', 'Headchef', 'Subchef', 'Supervisior', 'Waiter', 'Helper'), async (req, res) => {
  const { id, year, month } = req.params;
  console.log("User ID:", id, "Year:", year, "Month:", month);

  try {
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    const startDate = new Date(yearInt, monthInt - 1, 1);
    const endDate = new Date(yearInt, monthInt, 1);
    const numberOfDays = (endDate - startDate) / (1000 * 3600 * 24);

    // ✅ Get user basic info
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const basicSalData = user.basicSal;
    const UserId = user._id;
    const Name = user.name;

    // ✅ Get payments (allowance & service charge)
    const AllowanceAndServiceCharges = await Payments.find({
      createdAt: { $gte: startDate, $lt: endDate },
      userId: id
    });

    const allowance = AllowanceAndServiceCharges[0]?.allowance || 0;
    const serviceCharge = AllowanceAndServiceCharges[0]?.serviceCharge || 0;

    // ✅ Get other data
    const HalfSalData = await MiddleSal.find({
      createdAt: { $gte: startDate, $lt: endDate },
      Uid: id
    });

    const HalfDayData = await HalfDay.find({ 
      createdAt: { $gte: startDate, $lt: endDate },
      userId: id, 
    });

    const AttendanceData = await Attendance.find({ 
      createdAt: { $gte: startDate, $lt: endDate },
      userId: id,  
    });

    const LeaveData1 = await LeaveData.find({
      createdAt: { $gte: startDate, $lt: endDate },
      LeaveHolderId: id,
    });

    // ✅ Summaries
    const leaveStatus = LeaveData1?.map(record => record.Status);
    const approvedLeaveDays = leaveStatus?.filter(status => status === 'true').length || 0;

    const attendanceStatus = AttendanceData?.map(record => record.status);
    const presentDays = attendanceStatus?.filter(status => status === 'Present').length || 0;
    const halfDayAbsences = attendanceStatus?.filter(status => status === 'HalfDay').length || 0;

    const halfDayStatuses = HalfDayData?.map(record => record.status);
    const halfDayTrue = halfDayStatuses?.filter(status => status === 'true').length || 0;
    const halfDayFalse = halfDayStatuses?.filter(status => status === 'false').length || 0;

    // ✅ Calculations
    const PerDaySal = basicSalData / numberOfDays;
    const halfDaySalary = halfDayTrue * PerDaySal;

    const AcceptedHalfSal = HalfSalData?.reduce((sum, item) => sum + item.Salary, 0) || 0;

    const EPF = basicSalData * 0.08;
    const ETF = basicSalData * 0.03;

    const totalWorkedDays = presentDays + approvedLeaveDays + halfDayAbsences;
    const noPayDays = numberOfDays - totalWorkedDays;
    const NoPaySalary = noPayDays * PerDaySal;

    const TotalSalary =
      basicSalData
      - EPF
      - halfDaySalary
      - NoPaySalary
      - AcceptedHalfSal
      + Number(allowance)
      + Number(serviceCharge);

    // ✅ Final response
    res.status(200).json({
      UserId,
      name: Name,
      year: yearInt,
      month: monthInt,
      NetSalary: Number(TotalSalary),
      NoPay: Number(NoPaySalary),
      BasicSal: Number(basicSalData),
      ETF: Number(ETF),
      EPF: Number(EPF),
      NumberOfHalfDays: halfDayTrue + halfDayAbsences,
      NoPayDays: noPayDays,
      allowance: Number(allowance),
      serviceCharge: Number(serviceCharge)
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});


//Get only this month Attendence data
router.get('/UserAttendence/:year/:month', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  const { year, month } = req.params;
  console.log("called api");
  try {
    // Convert year and month to integers
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    if (isNaN(yearInt) || isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      return res.status(400).json({ message: 'Invalid year or month' });
    }

    // Calculate start and end of the month
    const startDate = new Date(yearInt, monthInt - 1, 1); // First day of the month
    const endDate = new Date(yearInt, monthInt, 1); // First day of next month

    // Step 1: Aggregate attendance data and count 'Present' and 'HalfDay' statuses for each user
    const userAttendance = await Attendance.aggregate([
      { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
      { 
        $group: {
          _id: "$userId", 
          presentCount: { 
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } 
          },
          halfDayCount: { 
            $sum: { $cond: [{ $eq: ["$status", "HalfDay"] }, 1, 0] } 
          }
        }
      },
      {
        // Combine the present and half-day counts
        $addFields: {
          totalAttendance: { $add: ["$presentCount", "$halfDayCount"] }
        }
      },
      { 
        // Sort by the total attendance count in ascending order (lowest first)
        $sort: { totalAttendance: 1 }
      }
    ]);

    console.log("User Attendance Data:", userAttendance);
    // Check if userAttendance has results
    if (userAttendance.length === 0) {
      return res.status(404).json({ message: 'No attendance data found for the given month' });
    }

    // Debugging the raw aggregation result
    console.log("Aggregated User Attendance:", userAttendance);

    // Step 2: Get the highest and lowest attendance users
    const lowestAttendanceUser = userAttendance[0]; // User with the lowest total attendance
    const highestAttendanceUser = userAttendance[userAttendance.length - 1]; // User with the highest total attendance

    // Debugging the highest and lowest attendance users
    console.log("Highest Attendance User:", highestAttendanceUser);
    console.log("Lowest Attendance User:", lowestAttendanceUser);

    // Step 3: Fetch user details for the highest and lowest attendance users
    const highestUserDetails = await User.findById(highestAttendanceUser._id);
    const lowestUserDetails = await User.findById(lowestAttendanceUser._id);

    if (!highestUserDetails || !lowestUserDetails) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 4: Return the response with the highest and lowest attendance users and their counts
    res.status(200).json({
      highestUserDetails: { 
        name: highestUserDetails.name, 
        totalAttendance: highestAttendanceUser.totalAttendance,
        presentCount: highestAttendanceUser.presentCount,
        halfDayCount: highestAttendanceUser.halfDayCount
      },
      lowestUserDetails: { 
        name: lowestUserDetails.name, 
        totalAttendance: lowestAttendanceUser.totalAttendance,
        presentCount: lowestAttendanceUser.presentCount,
        halfDayCount: lowestAttendanceUser.halfDayCount
      }
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//get the lowest and highest NoPay data
router.get('/getSalHighestAndLovestSal/:year/:month', verifyToken, authorizeRoles(
  'Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'
), async (req, res) => {
  const { year, month } = req.params;
  console.log("Year:", year, "Month:", month);

  try {
    // Convert year and month to integers
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    // Calculate start and end of the month
    const startDate = new Date(yearInt, monthInt - 1, 1); // First day of the month
    const endDate = new Date(yearInt, monthInt, 1); // First day of next month

    const numberOfDays = (endDate - startDate) / (1000 * 3600 * 24); // Correct calculation for number of days in month

    // Fetch all users
    const users = await User.find({});
    const results = [];

    for (const user of users) {
      const id = user._id;
      const basicSalData = user.basicSal;
      const UserId = user._id;
      const Name = user.name;

      const HalfSalData = await MiddleSal.find({
        createdAt: { $gte: startDate, $lt: endDate },
        Uid: id
      });

      const HalfDayData = await HalfDay.find({
        createdAt: { $gte: startDate, $lt: endDate },
        userId: id
      });

      const AttendanceData = await Attendance.find({
        createdAt: { $gte: startDate, $lt: endDate },
        userId: id
      });

      const LeaveData1 = await LeaveData.find({
        createdAt: { $gte: startDate, $lt: endDate },
        LeaveHolderId: id
      });

      // Leave data summary
      const leaveStatus = LeaveData1?.map(record => record.status);
      const leaveDays = leaveStatus.filter(status => status === 'true').length;
      const leaveDaysFalse = leaveStatus.filter(status => status === 'false').length;

      // Attendance Summary
      const attendanceStatus = AttendanceData?.map(record => record.status);
      const presentDays = attendanceStatus.filter(status => status === 'Present').length;
      const absentDays = attendanceStatus.filter(status => status === 'HalfDay').length;

      // Half Day Data Summary
      const halfDayCount = HalfDayData?.map(record => record.status);
      const halfDayFalse = halfDayCount.filter(status => status === 'false').length;
      const halfDayTrue = halfDayCount.filter(status => status === 'true').length;

      // Calculate the per day salary based on the number of days in the month
      const daysInMonth = new Date(yearInt, monthInt, 0).getDate();
      const PerDaySal = basicSalData / daysInMonth;

      // Calculate Full and Half Day Salary
      const fullHalfDayCount = halfDayTrue * PerDaySal;

      // Calculate the Accepted Half Salary
      const AcceptedHalfSal = HalfSalData?.map(salData => salData.Salary)
        .reduce((sum, val) => sum + val, 0); // Sum the values for accepted half salary

      // Calculate EPF, ETF, and NoPaySalary
      const EpF = basicSalData * 0.08;
      const ETF = basicSalData * 0.03;  // Only paid by company
      const NoPaySal = ((numberOfDays - (presentDays + absentDays) - leaveDays) * PerDaySal);

      // Calculate NoPayDays (the days where the user had no pay, i.e., absent, half day, or leave)
      const NoPayDays = numberOfDays - (presentDays + halfDayTrue + leaveDays);
      console.log("NoPayDays for", Name, ":", NoPayDays);

      // Add this user's results to the array
      results.push({
        UserId: UserId,
        name: Name,
        NoPayDays: NoPayDays, // Store the NoPayDays count
        NetSalary: basicSalData - EpF - fullHalfDayCount - NoPaySal - AcceptedHalfSal,
        NoPay: NoPaySal,
      });
    }

    // Find the user with the highest and lowest NoPayDays
    const highestNoPayUser = results.reduce((max, user) => (user.NoPayDays > max.NoPayDays ? user : max), results[0]);
    const lowestNoPayUser = results.reduce((min, user) => (user.NoPayDays < min.NoPayDays ? user : min), results[0]);

    // Send response with the highest and lowest NoPayDays data
    res.status(200).json({
      highestNoPayUser: {
        name: highestNoPayUser.name,
        NoPayDays: highestNoPayUser.NoPayDays,
      },
      lowestNoPayUser: {
        name: lowestNoPayUser.name,
        NoPayDays: lowestNoPayUser.NoPayDays,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
    console.error("Error:", error);
  }
});


//get the all usersdata with there relavant EMPID,AttendDAta,NopayDate
router.get('/getAllUsersAttendanceNoPay/:year/:month', verifyToken, authorizeRoles(
  'Admin', 'Maneger', 'Headchef', 'Subchef', 'Supervisior', 'Waiter', 'Helper'
), async (req, res) => {
  const { year, month } = req.params;
  console.log("Year:", year, "Month:", month);

  try {
    // Convert year and month to integers
    const yearInt = parseInt(year, 10);
    const monthInt = parseInt(month, 10);

    // Calculate start and end of the month
    const startDate = new Date(yearInt, monthInt - 1, 1); // First day of the month
    const endDate = new Date(yearInt, monthInt, 1); // First day of next month

    // Fetch all users
    const users = await User.find({});

    // Array to hold user data
    const userAttendanceNoPayData = [];

    for (const user of users) {
      const { _id, name } = user;
      const UserId = _id;
      const Name = name;
      
      // Fetch data for each user
      const AttendanceData = await Attendance.find({ 
        createdAt: { $gte: startDate, $lt: endDate },
        userId: _id,  
      });

      const LeaveData1 = await LeaveData.find({
        createdAt: { $gte: startDate, $lt: endDate },
        LeaveHolderId: _id,
      });

      // Leave data summary
      const leaveStatus = LeaveData1?.map(record => record.Status);
      const leaveDays = leaveStatus.filter(status => status === 'true').length;
      const leaveDaysFalse = leaveStatus.filter(status => status === 'false').length;

      // Attendance summary
      const attendanceStatus = AttendanceData?.map(record => record.status);
      const presentDays = attendanceStatus.filter(status => status === 'Present').length;

      // Calculate NoPay days (days that are not present, absent, or on leave)
      const noPayDays = (new Date(yearInt, monthInt, 0).getDate() - (presentDays + leaveDays + leaveDaysFalse));

      // Add the user data to the array
      userAttendanceNoPayData.push({
        Name: Name,
        empId: UserId,
        attendedDays: presentDays,
        noPayDays: noPayDays,
      });
    }

    // Send the response with all user attendance and no pay data
    res.status(200).json({
      year: yearInt,
      month: monthInt,
      userAttendanceNoPayData,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching data for all users' });
    console.error("Error:", error);
  }
});


//get aproved leave data
// Get approved leave data
router.get('/getApprovedLeaveData', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the current month
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of the current month
  
  try {
    // Step 1: Filter approved leaves and group them by LeaveHolderId
    const approvedLeaves = await LeaveData.aggregate([
      {
        $match: { 
          status: "true", 
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$LeaveHolderId",
          approvedCount: { $sum: 1 }
        }
      },
      {
        $sort: { approvedCount: -1 }
      }
    ]);

    if (approvedLeaves.length === 0) {
      return res.status(404).json({ message: "No approved leaves found" });
    }

    // Step 2: Get top and bottom users
    const highest = approvedLeaves[0];
    const lowest = approvedLeaves[approvedLeaves.length - 1];

    console.log("Highest:", highest);
    console.log("Lowest:", lowest);

    // Step 3: Fetch user info
    const highestUser = await User.findById(highest._id).select("name");
    const lowestUser = await User.findById(lowest._id).select("name");

    // Step 4: Send response
    res.status(200).json({
      highestLeave: {
        LeaveHolderId: highest._id,
        name: highestUser ? highestUser.name : "Unknown",
        approvedLeaveCount: highest.approvedCount
      },
      lowestLeave: {
        LeaveHolderId: lowest._id,
        name: lowestUser ? lowestUser.name : "Unknown",
        approvedLeaveCount: lowest.approvedCount
      }
    });

  } catch (error) {
    console.error("Error fetching approved leave data:", error);
    res.status(500).json({ message: 'Server error while retrieving leave data' });
  }
});


//get the all users attendence data
router.get('/getAllApprovedLeaveCounts', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  

   const now = new Date();

    // If year/month provided in query, use them, otherwise use current year/month
  const yearInt = parseInt(req.query.year) || now.getFullYear();
  const monthInt = parseInt(req.query.month) || now.getMonth() + 1; // getMonth() is 0-indexed

  const startDate = new Date(yearInt, monthInt - 1, 1); // First day of the month
  const endDate = new Date(yearInt, monthInt, 1); // First day of next month
  
  try {
    // Step 1: Get approved leaves grouped by LeaveHolderId
    const approvedLeaveData = await LeaveData.aggregate([
      {
        $match: { status: "true" },
        createdAt: { $gte: startDate, $lte: endDate }
      },
      {
        $group: {
          _id: "$LeaveHolderId",
          approvedCount: { $sum: 1 }
        }
      },
      {
        $sort: { approvedCount: -1 }
      }
    ]);

    if (approvedLeaveData.length === 0) {
      return res.status(404).json({ message: "No approved leave data found" });
    }

    // Step 2: For each grouped result, get the user's name
    const result = await Promise.all(
      approvedLeaveData.map(async (entry) => {
        const user = await User.findById(entry._id).select("name");
        return {
          LeaveHolderId: entry._id,
          name: user ? user.name : "Unknown",
          approvedLeaveCount: entry.approvedCount
        };
      })
    );

    // Step 3: Send response
    res.status(200).json(result);

  } catch (error) {
    console.error("Error fetching all approved leave counts:", error);
    res.status(500).json({ message: 'Server error while retrieving approved leave counts' });
  }
});

//get Minimum Halfday users and Maximum Halfday users
router.get('/getMinAndMaxHalfDayUsers', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
    
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // First day of the current month
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  try {
    // Step 1: Get half-day users grouped by userId
    const halfDayData = await HalfDay.aggregate([
      // Step 1: Match only users with 'true' status
      {
        $match: {
          status: "true" ,// Only include records where the status is 'true'
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$userId", // Group by userId
          halfDayCount: { $sum: 1 }, // Count the number of half-day requests
        }
      },
      {
        $sort: { halfDayCount: -1 } // Sort by halfDayCount in descending order (highest count first)
      }
    ]);

    if (halfDayData.length === 0) {
      return res.status(404).json({ message: "No half-day data found" });
    }

    // Step 2: Get the user with the minimum and maximum half-days
    const minHalfDayUser = halfDayData[0];
    const maxHalfDayUser = halfDayData[halfDayData.length - 1];

    console.log("Min Half-Day User:", minHalfDayUser);
    console.log("Max Half-Day User:", maxHalfDayUser);

    // Step 3: Fetch user info
    const minUser = await User.findById(minHalfDayUser._id).select("name");
    const maxUser = await User.findById(maxHalfDayUser._id).select("name");

    // Step 4: Send response
    res.status(200).json({
      minHalfDayUser: {
        userId: minHalfDayUser._id,
        name: minUser ? minUser.name : "Unknown",
        halfDayCount: minHalfDayUser.halfDayCount
      },
      maxHalfDayUser: {
        userId: maxHalfDayUser._id,
        name: maxUser ? maxUser.name : "Unknown",
        halfDayCount: maxHalfDayUser.halfDayCount
      }
    });

  } catch (error) {
    console.error("Error fetching half-day data:", error);
    res.status(500).json({ message: 'Server error while retrieving half-day data' });
  }
});


//get all the aproved halfDay data
router.get('/getAllApprovedHalfDayRequests', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    // Step 1: Fetch all half-day records where status is 'true' (approved half-day requests)
    const approvedHalfDayData = await HalfDay.find({
      status: "true", // Filter for approved half-day requests
    });

    // If no approved half-day records are found, send a message
    if (approvedHalfDayData.length === 0) {
      return res.status(404).json({ message: "No approved half-day data found" });
    }

    const usersName = await Promise.all(
      approvedHalfDayData.map(async (record) => {
        const user = await User.findById(record.userId).select("name");
        return {
          userId: record.userId,
          name: user ? user.name : "Unknown",
          date: record.date,
          whichHalf: record.whichHalf,
        };
      })
    );

    // Step 2: Send the fetched data as a response
    res.status(200).json({
      approvedHalfDayData: usersName
    });
  } catch (error) {
    console.error("Error fetching approved half-day data:", error);
    res.status(500).json({ message: 'Server error while retrieving approved half-day data' });
  }
});


//Get maximum and minimum of the not aprooved Halfday list
router.get('/getMinAndMaxNotAproved', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
 
  
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // First day of the current month
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // Last day of the current month

  try {
    // Step 1: Get half-day users grouped by userId
    const halfDayData = await HalfDay.aggregate([
      // Step 1: Match only users with 'true' status
      {
        $match: {
          status: "false", // Only include records where the status is 'true'
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: "$userId", // Group by userId
          halfDayCount: { $sum: 1 }, // Count the number of half-day requests
        }
      },
      {
        $sort: { halfDayCount: -1 } // Sort by halfDayCount in descending order (highest count first)
      }
    ]);

    if (halfDayData.length === 0) {
      return res.status(404).json({ message: "No half-day data found" });
    }

    // Step 2: Get the user with the minimum and maximum half-days
    const minHalfDayUser = halfDayData[0];
    const maxHalfDayUser = halfDayData[halfDayData.length - 1];

    console.log("Min Half-Day User:", minHalfDayUser);
    console.log("Max Half-Day User:", maxHalfDayUser);

    // Step 3: Fetch user info
    const minUser = await User.findById(minHalfDayUser._id).select("name");
    const maxUser = await User.findById(maxHalfDayUser._id).select("name");

    // Step 4: Send response
    res.status(200).json({
      minHalfDayUser: {
        userId: minHalfDayUser._id,
        name: minUser ? minUser.name : "Unknown",
        halfDayCount: minHalfDayUser.halfDayCount
      },
      maxHalfDayUser: {
        userId: maxHalfDayUser._id,
        name: maxUser ? maxUser.name : "Unknown",
        halfDayCount: maxHalfDayUser.halfDayCount
      }
    });

  } catch (error) {
    console.error("Error fetching half-day data:", error);
    res.status(500).json({ message: 'Server error while retrieving half-day data' });
  }
});


//get all the not aproved halfDay data
router.get('/getAllNotApprovedHalfDayRequests', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    // Step 1: Fetch all half-day records where status is 'true' (approved half-day requests)
    const approvedHalfDayData = await HalfDay.find({
      status: "false", // Filter for approved half-day requests
    });

    // If no approved half-day records are found, send a message
    if (approvedHalfDayData.length === 0) {
      return res.status(404).json({ message: "No approved half-day data found" });
    }

    const usersName = await Promise.all(
      approvedHalfDayData.map(async (record) => {
        const user = await User.findById(record.userId).select("name");
        return {
          userId: record.userId,
          name: user ? user.name : "Unknown",
          date: record.date,
          whichHalf: record.whichHalf,
        };
      })
    );

    // Step 2: Send the fetched data as a response
    res.status(200).json({
      approvedHalfDayData: usersName
    });
  } catch (error) {
    console.error("Error fetching approved half-day data:", error);
    res.status(500).json({ message: 'Server error while retrieving approved half-day data' });
  }
});



//get Not aproved leave data(Highest and Lowest)
router.get('/getNotApprovedLeaveData', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
 
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // First day of the current month
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // Last day of the current month
 
  try {
    // Step 1: Filter approved leaves and group them by LeaveHolderId
    const approvedLeaves = await LeaveData.aggregate([
      {
        $match: { status: "false" },
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      },
      {
        $group: {
          _id: "$LeaveHolderId",
          approvedCount: { $sum: 1 }
        }
      },
      {
        $sort: { approvedCount: -1 }
      }
    ]);

    if (approvedLeaves.length === 0) {
      return res.status(404).json({ message: "No approved leaves found" });
    }

    // Step 2: Get top and bottom users
    const highest = approvedLeaves[0];
    const lowest = approvedLeaves[approvedLeaves.length - 1];

    console.log("Highest:", highest);
    console.log("Lowest:", lowest);

    // Step 3: Fetch user info
    const highestUser = await User.findById(highest._id).select("name");
    const lowestUser = await User.findById(lowest._id).select("name");

    // Step 4: Send response
    res.status(200).json({
      highestLeave: {
        LeaveHolderId: highest._id,
        name: highestUser ? highestUser.name : "Unknown",
        approvedLeaveCount: highest.approvedCount
      },
      lowestLeave: {
        LeaveHolderId: lowest._id,
        name: lowestUser ? lowestUser.name : "Unknown",
        approvedLeaveCount: lowest.approvedCount
      }
    });

  } catch (error) {
    console.error("Error fetching approved leave data:", error);
    res.status(500).json({ message: 'Server error while retrieving leave data' });
  }
});


//get the all users Not attendence data
router.get('/getAllNotApprovedHalfDayRequests', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    // Step 1: Fetch all half-day records where status is 'true' (approved half-day requests)
    const approvedHalfDayData = await LeaveData.find({
      status: "false", // Filter for approved half-day requests
    });

    // If no approved half-day records are found, send a message
    if (approvedHalfDayData.length === 0) {
      return res.status(404).json({ message: "No approved half-day data found" });
    }

    const usersName = await Promise.all(
      approvedHalfDayData.map(async (record) => {
        const user = await User.findById(record.userId).select("name");
        return {
          userId: record.userId,
          name: user ? user.name : "Unknown",
          date: record.date,
          whichHalf: record.whichHalf,
        };
      })
    );

    // Step 2: Send the fetched data as a response
    res.status(200).json({
      approvedHalfDayData: usersName
    });
  } catch (error) {
    console.error("Error fetching approved half-day data:", error);
    res.status(500).json({ message: 'Server error while retrieving approved half-day data' });
  }
});


//get the aproved Advance payment data mimum user and maximum user
router.get('/getMinAndMaxAdvancePaymentUsers', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    // Get the current date and calculate the first day and last day of the current month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // First day of the current month
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // Last day of the current month

    // Step 1: Fetch users with 'true' status and filter based on createdAt being in the current month
    const halfDayData = await MiddleSal.aggregate([
      {
        $match: {
          Status: "true", // Only include records where the status is 'true'
          createdAt: { $gte: startOfMonth, $lte: endOfMonth } // Filter based on createdAt in the current month
        }
      },
      {
        $sort: { Salary: -1 } // Sort by Salary in descending order (highest salary first)
      }
    ]);

    console.log("Half Day Data:", halfDayData);

    if (halfDayData.length === 0) {
      return res.status(404).json({ message: "No approved half-day data found for the current month" });
    }

    // Step 2: Get the user with the highest salary (first in the array after sorting)
    const maxSalaryUser = halfDayData[0];

    // Step 3: Get the user with the lowest salary (last in the array after sorting)
    const minSalaryUser = halfDayData[halfDayData.length - 1];

    // Step 4: Fetch user info by userId for both max and min salary users
    const maxUser = await User.findById(maxSalaryUser._id).select("name");
    const minUser = await User.findById(minSalaryUser._id).select("name");

    // Step 5: Send the response with the highest and lowest salary users
    res.status(200).json({
      maxSalaryUser: {
        userId: maxSalaryUser._id,
        name: maxUser ? maxUser.name : "Unknown",
        Salary: maxSalaryUser.Salary
      },
      minSalaryUser: {
        userId: minSalaryUser._id,
        name: minUser ? minUser.name : "Unknown",
        Salary: minSalaryUser.Salary
      }
    });
  } catch (error) {
    console.error("Error fetching min and max salary users:", error);
    res.status(500).json({ message: "Error fetching salary data" });
  }
});


//get the all users Advance payment data
router.get('/getAllUsersAdvancePayment', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    // Get the current date and calculate the first day and last day of the current month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // First day of the current month
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // Last day of the current month

    // Step 1: Fetch users with 'true' status and filter based on createdAt being in the current month
    const usersData = await MiddleSal.aggregate([
      {
        $match: {
          Status: "true", // Only include records where the status is 'true'
          createdAt: { $gte: startOfMonth, $lte: endOfMonth } // Filter based on createdAt in the current month
        }
      },
      {
        $project: {
          _id: 1,  // Include _id
          Name: 1,  // Include user name
          Salary: 1, // Include email (You can adjust the fields you want to return)
          createdAt: 1,  // Include createdAt date for debugging
          Status: 1,  // Include Status
        }
      }
    ]);

    if (usersData.length === 0) {
      return res.status(404).json({ message: "No users found with 'true' status for the current month" });
    }

    // Step 2: Return the data
    res.status(200).json({ usersData });

  } catch (error) {
    console.error("Error fetching users with true status:", error);
    res.status(500).json({ message: "Error fetching users with true status" });
  }
});


//get the all users HalfDay data
router.get('/getAllUsersHalfDayData', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    // Get the current date and calculate the first day and last day of the current month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // First day of the current month
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // Last day of the current month

    // Step 1: Fetch users with 'true' status and filter based on createdAt being in the current month
    const usersData = await HalfDay.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }, // Filter based on createdAt in the current month
          status: { $in: ["true", "Non","false"] }, // Only include records where the status is 'true'
        }
      },
      {
        $project: {
          _id: 1,  // Include _id
          userId: 1,  // Include user ID
          date: 1, // Include date
          whichHalf: 1,  // Include whichHalf
          status: 1,  // Include status
        }
      }
    ]);

    if (usersData.length === 0) {
      return res.status(404).json({ message: "No users found with 'true' status for the current month" });
    }

    // Fetch the user details (name) for each HalfDay record
    const users = await Promise.all(
      usersData.map(async (record) => {
        const user = await User.findById(record.userId).select("name");
        return {
          _id: record._id,
          userId: record.userId,
          name: user ? user.name : "Unknown",
          date: record.date,
          status: record.status,
          whichHalf: record.whichHalf,
        };
      })
    );

    // Step 2: Return the data
    res.status(200).json({ users });

  } catch (error) {
    console.error("Error fetching users with true status:", error);
    res.status(500).json({ message: "Error fetching users with true status" });
  }
});


//update halfday data
router.put('/updateHalfDayData/:id', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  const { id } = req.params;
  const { status,reason} = req.body;
  try{

    const halfDayData=await HalfDay.findByIdAndUpdate(id,{
      status:status,
      reason:reason
    },{new:true});

    if(!halfDayData){
      return res.status(404).json({message:"HalfDay data not found"});
    }

    res.status(200).json({"message":"HalfDay data updated successfully"});

    }catch(error){
      console.error("Error:",error);
      res.status(500).json({message:"Internal Server Error"});
    }
});


//get all allowance data
router.get('/getAllowances', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
     
      try{
        const allowanceData=await Allowance.find({});

        if(allowanceData.length===0){
          return res.status(404).json({message:"No allowance data found"});
        }

        res.status(200).json({allowanceData});

      }catch(error){
        console.error("Error:",error);
        res.status(500).json({message:"Internal Server Error"});
      }
});


//Add the allowances or the serviceCharge
router.post('/addPaymentData', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  const { userId, serviceCharge, allowance } = req.body;

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const existingPayment = await Payments.findOne({
      userId: userId,
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    if (existingPayment) {
      // ✅ UPDATE existing payment
      existingPayment.allowance = allowance || existingPayment.allowance;
      existingPayment.serviceCharge = serviceCharge || existingPayment.serviceCharge;

      await existingPayment.save();

      return res.status(200).json({
        message: 'Payment data updated for current month',
        paymentData: existingPayment
      });
    }

    // ✅ CREATE new payment
    const newPayment = await Payments.create({
      userId,
      serviceCharge,
      allowance,
    });

    res.status(201).json({ message: 'Payment data added successfully', paymentData: newPayment });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Get current user's payment data for the current month
router.get('/getAllPaymentData/:userId', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    const {userId} =req.params; // Assuming the user ID is attached to the request after the token is verified
    console.log("User ID:", userId);
    // Get the current date and calculate the first and last day of the current month
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // First day of the current month
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  // Last day of the current month

    // Find payment data for the current user in the current month
    const paymentData = await Payments.find({
     // Match the user ID
     createdAt: { $gte: startOfMonth, $lte: endOfMonth },  // Match payments created within the current month
     userId: userId, 
    });

    if (paymentData.length === 0) {
      return res.status(404).json({ message: 'No payment data found for the current month' });
    }

    // Return the payment data
    res.status(200).json({ paymentData });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//Get all Users details
router.get('/AllRegUsersData', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//add userId data
router.put('/ChangeUserIdData', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  const {userId} = req.body;
  const Id="681fa18a3b053da7b0c34bff"
  try {
    const idData=await LastEmp.findByIdAndUpdate(Id,{userId},{new:true});
    res.status(201).json({ message: 'User data added successfully', idData});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



//get all userId data
router.get('/getAllUserIdData', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor', 'Waiter', 'Helper'), async (req, res) => {
  try {
    const userIdData = await LastEmp.find({});

    if (userIdData.length === 0) {
      return res.status(404).json({ message: 'No user ID data found' });
    }

    res.status(200).json(userIdData);
    console.log("User ID Data:", userIdData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//Update the Users(role) and the basic salary
router.put('/updateUserRoleAndSalary/:id', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor'), async (req, res) => {
  const { id } = req.params;
  const { role, basicSal } = req.body;

  try {
    // Find the user by ID and update their role and basic salary
    const updatedUser = await User.findByIdAndUpdate(id, { role, basicSal }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User role and salary updated successfully', updatedUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//Update the user role and the basic salary
router.put('/updateRoleSal/:id', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor'), async (req, res) => {
  const { id } = req.params;
  const { role, basicSal,telephone,address,maritalStatus,empType, bankName, bankBranch, accountNo} = req.body;

  console.log("Updating user with ID:", id, "Role:", role, "Basic Salary:", basicSal);

  try {
    // Find the user by ID and update their role and basic salary
    const updatedUser = await User.findByIdAndUpdate(id, { role, basicSal,telephone,address,maritalStatus,empType, bankName, bankBranch, accountNo }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Data updated successfully', updatedUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})



//--------------------------------------------------------
// Main EPF API with correct UserId field mapping and proper date filtering
router.get('/getEpfModelData/:month/:year', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor'), async (req, res) => {
  const { month, year } = req.params;
   
  console.log("=== EPF Data Request ===");
  console.log("Month:", month, "Year:", year);
  
  try {
    // Validate parameters
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);
    
    if (!monthInt || !yearInt || monthInt < 1 || monthInt > 12) {
      return res.status(400).json({ message: 'Invalid month or year' });
    }

    // Create proper date range for the selected month/year
    const startDate = new Date(yearInt, monthInt - 1, 1); // First day of month
    const endDate = new Date(yearInt, monthInt, 0, 23, 59, 59, 999); // Last day of month
    
    console.log("Date range:", startDate.toISOString(), "to", endDate.toISOString());

    // First, let's check what EPF data exists in the entire collection
    const totalEpfCount = await EPFModel.countDocuments();
    console.log("Total EPF records in database:", totalEpfCount);

    // Check EPF data in the date range (without Employer filter first)
    const epfInDateRange = await EPFModel.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).lean();

    console.log("EPF records in date range:", epfInDateRange.length);

    // If no records in date range, let's see what dates are available
    if (epfInDateRange.length === 0) {
      const sampleDates = await EPFModel.find({}, { createdAt: 1 }).limit(10).lean();
      console.log("Sample available dates:", sampleDates.map(d => ({
        date: d.createdAt,
        month: d.createdAt.getMonth() + 1,
        year: d.createdAt.getFullYear()
      })));
      
      return res.status(404).json({ 
        message: `No EPF data found for ${getMonthName(monthInt)} ${yearInt}.`,
        availableDates: sampleDates.map(d => d.createdAt),
        searchedRange: { startDate, endDate }
      });
    }

    // Now filter for records with Employer > 0 OR Employee > 0 (to include employee contributions)
    const epfRecords = epfInDateRange.filter(record => 
      (record.Employer && record.Employer > 0) || (record.Employee && record.Employee > 0)
    );

    console.log("EPF records with contributions:", epfRecords.length);
    console.log("Sample EPF record:", epfRecords[0]);

    if (epfRecords.length === 0) {
      return res.status(404).json({ 
        message: `EPF data found for ${getMonthName(monthInt)} ${yearInt}, but no records have employer or employee contributions.`,
        totalRecordsInPeriod: epfInDateRange.length
      });
    }

    // Extract unique UserIds (note: using UserId field from your EPF model)
    const userIds = [...new Set(epfRecords
      .map(record => record.UserId)
      .filter(id => id && mongoose.Types.ObjectId.isValid(id))
    )];

    console.log("Unique UserIds found:", userIds.length);

    // Fetch all users in one query
    let users = [];
    if (userIds.length > 0) {
      users = await User.find({
        _id: { $in: userIds }
      }).lean();
    }

    console.log("Users fetched:", users.length);

    // Create user lookup map
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    // Transform data with user information using correct field names
    const transformedData = epfRecords.map(epfRecord => {
      // Find user by UserId
      const user = userMap[epfRecord.UserId?.toString()];

      // Debug log for first record
      if (epfRecord === epfRecords[0]) {
        console.log("First EPF record details:", {
          epfId: epfRecord._id,
          UserId: epfRecord.UserId,
          EmployeeId: epfRecord.EmployeeId,
          Employee: epfRecord.Employee,
          Employer: epfRecord.Employer,
          userFound: !!user,
          userName: user?.name
        });
      }

      return {
        _id: epfRecord._id,
        employeeId: epfRecord.EmployeeId || user?.empId || 'N/A',
        employeeName: user?.name || 'Name Not Found',
        basicSalary: parseInt(user?.basicSal) || 0,
        role: user?.role || 'Role Not Found',
        Employee: epfRecord.Employee || 0, // Employee contribution - this was the issue!
        Employer: epfRecord.Employer || 0,  // Employer contribution
        createdAt: epfRecord.createdAt,
        userId: user?._id || null,
        userFound: !!user
      };
    });

    console.log("Final transformed data count:", transformedData.length);
    console.log("Sample transformed record:", transformedData[0]);

    // Count records with and without user data
    const withUserData = transformedData.filter(item => item.userFound);
    const withoutUserData = transformedData.filter(item => !item.userFound);

    console.log("Records with user data:", withUserData.length);
    console.log("Records without user data:", withoutUserData.length);

    res.status(200).json({ 
      epfData: transformedData,
      totalRecords: transformedData.length,
      recordsWithUserData: withUserData.length,
      recordsWithoutUserData: withoutUserData.length,
      dateRange: { startDate, endDate },
      month: getMonthName(monthInt),
      year: yearInt
    });

  } catch (error) {
    console.error("Error in getEpfModelData:", error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server Error'
    });
  }
});

// Helper function to get month name
function getMonthName(monthNumber) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1] || 'Unknown';
}

// Alternative API using aggregation with correct field names and date filtering
router.get('/getEpfModelDataAggregated/:month/:year', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor'), async (req, res) => {
  const { month, year } = req.params;
  
  try {
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);
    
    // Create proper date range
    const startDate = new Date(yearInt, monthInt - 1, 1);
    const endDate = new Date(yearInt, monthInt, 0, 23, 59, 59, 999);

    console.log("Aggregation - Date range:", startDate.toISOString(), "to", endDate.toISOString());

    const result = await EPFModel.aggregate([
      // Match EPF records in date range with any contributions
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          $or: [
            { Employer: { $gt: 0 } },
            { Employee: { $gt: 0 } }
          ]
        }
      },
      // Convert UserId to ObjectId if it's a string
      {
        $addFields: {
          userObjectId: {
            $cond: {
              if: { $type: "$UserId" },
              then: { $toObjectId: "$UserId" },
              else: "$UserId"
            }
          }
        }
      },
      // Lookup user data using UserId field
      {
        $lookup: {
          from: 'users',
          localField: 'userObjectId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      // Get the first user from the array
      {
        $addFields: {
          user: { $arrayElemAt: ["$userDetails", 0] }
        }
      },
      // Project final structure with correct field mappings
      {
        $project: {
          _id: 1,
          employeeId: {
            $ifNull: ["$EmployeeId", "$user.empId", "N/A"]
          },
          employeeName: {
            $ifNull: ["$user.name", "Name Not Found"]
          },
          basicSalary: {
            $cond: {
              if: { $ne: ["$user.basicSal", null] },
              then: { $toInt: "$user.basicSal" },
              else: 0
            }
          },
          role: {
            $ifNull: ["$user.role", "Role Not Found"]
          },
          Employee: { $ifNull: ["$Employee", 0] }, // Make sure Employee contribution is included
          Employer: { $ifNull: ["$Employer", 0] },
          createdAt: 1,
          userFound: { $ne: ["$user", null] }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    console.log("Aggregated result count:", result.length);
    if (result.length > 0) {
      console.log("Sample aggregated record:", result[0]);
    }

    if (result.length === 0) {
      return res.status(404).json({ 
        message: `No EPF data found for ${getMonthName(monthInt)} ${yearInt}.`
      });
    }

    res.status(200).json({ 
      epfData: result,
      totalRecords: result.length,
      recordsWithUserData: result.filter(item => item.userFound).length,
      recordsWithoutUserData: result.filter(item => !item.userFound).length,
      month: getMonthName(monthInt),
      year: yearInt
    });

  } catch (error) {
    console.error("Aggregation error:", error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: error.message
    });
  }
});

// Debug endpoint to check what data exists
router.get('/debugEpfDates', verifyToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    // Get all EPF records with their dates
    const allRecords = await EPFModel.find({}, { 
      createdAt: 1, 
      UserId: 1, 
      EmployeeId: 1, 
      Employee: 1, 
      Employer: 1 
    }).sort({ createdAt: -1 }).limit(20).lean();

    // Group by month/year
    const dateGroups = {};
    allRecords.forEach(record => {
      const date = new Date(record.createdAt);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!dateGroups[monthYear]) {
        dateGroups[monthYear] = [];
      }
      dateGroups[monthYear].push(record);
    });

    res.json({
      totalRecords: await EPFModel.countDocuments(),
      recentRecords: allRecords,
      dateGroups: Object.keys(dateGroups).map(monthYear => ({
        monthYear,
        count: dateGroups[monthYear].length,
        hasEmployer: dateGroups[monthYear].filter(r => r.Employer > 0).length,
        hasEmployee: dateGroups[monthYear].filter(r => r.Employee > 0).length
      }))
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Additional helper endpoint to check available dates
router.get('/getAvailableEpfDates', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor'), async (req, res) => {
  try {
    const availableDates = await EPFModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 },
          withEmployer: {
            $sum: { $cond: [{ $gt: ["$Employer", 0] }, 1, 0] }
          },
          withEmployee: {
            $sum: { $cond: [{ $gt: ["$Employee", 0] }, 1, 0] }
          },
          minDate: { $min: "$createdAt" },
          maxDate: { $max: "$createdAt" }
        }
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }
      }
    ]);
    res.status(200).json({ availableDates });
  } catch (error) {
    console.error("Error getting available dates:", error);
    res.status(500).json({ message: 'Error fetching available dates' });
  }
});

// Debug endpoint to check EPF model structure
router.get('/debugEpfModel', verifyToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const sampleRecord = await EPFModel.findOne().lean();
    const totalCount = await EPFModel.countDocuments();
    
    res.status(200).json({
      totalRecords: totalCount,
      sampleRecord: sampleRecord,
      modelFields: sampleRecord ? Object.keys(sampleRecord) : []
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ message: 'Debug error' });
  }
});

// Additional helper endpoint to check available dates
router.get('/getAvailableEpfDates', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor'), async (req, res) => {
  try {
    const availableDates = await EPFModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 },
          minDate: { $min: "$createdAt" },
          maxDate: { $max: "$createdAt" }
        }
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }
      }
    ]);

    res.status(200).json({ availableDates });
  } catch (error) {
    console.error("Error getting available dates:", error);
    res.status(500).json({ message: 'Error fetching available dates' });
  }
});

// Debug endpoint to check EPF model structure
router.get('/debugEpfModel', verifyToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const sampleRecord = await EPFModel.findOne().lean();
    const totalCount = await EPFModel.countDocuments();
    
    res.status(200).json({
      totalRecords: totalCount,
      sampleRecord: sampleRecord,
      modelFields: sampleRecord ? Object.keys(sampleRecord) : []
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ message: 'Debug error' });
  }
});



//---------------------------------------------------------------


// Main ETF API using EPFModel with Employer field as ETF contribution
router.get('/getEtfModelData/:month/:year', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor'), async (req, res) => {
  const { month, year } = req.params;
   
  console.log("=== ETF Data Request (using EPFModel Employer field) ===");
  console.log("Month:", month, "Year:", year);
  
  try {
    // Validate parameters
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);
    
    if (!monthInt || !yearInt || monthInt < 1 || monthInt > 12) {
      return res.status(400).json({ message: 'Invalid month or year' });
    }

    // Create proper date range for the selected month/year
    const startDate = new Date(yearInt, monthInt - 1, 1); // First day of month
    const endDate = new Date(yearInt, monthInt, 0, 23, 59, 59, 999); // Last day of month
    
    console.log("Date range:", startDate.toISOString(), "to", endDate.toISOString());

    // First, let's check what EPF data exists in the entire collection
    const totalEpfCount = await EPFModel.countDocuments();
    console.log("Total EPF records in database:", totalEpfCount);

    // Check EPF data in the date range
    const epfInDateRange = await EPFModel.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).lean();

    console.log("EPF records in date range:", epfInDateRange.length);

    // If no records in date range, return empty result
    if (epfInDateRange.length === 0) {
      return res.status(404).json({ 
        message: `No ETF data found for ${getMonthName(monthInt)} ${yearInt}.`,
        searchedRange: { startDate, endDate }
      });
    }

    // Filter for records with Employer (ETF) contributions > 0
    const etfRecords = epfInDateRange.filter(record => 
      record.Employer && record.Employer > 0
    );

    console.log("EPF records with Employer (ETF) contributions:", etfRecords.length);
    console.log("Sample EPF record for ETF:", etfRecords[0]);

    if (etfRecords.length === 0) {
      return res.status(404).json({ 
        message: `ETF data found for ${getMonthName(monthInt)} ${yearInt}, but no records have Employer contributions.`,
        totalRecordsInPeriod: epfInDateRange.length
      });
    }

    // Extract unique UserIds (note: using UserId field from your EPF model)
    const userIds = [...new Set(etfRecords
      .map(record => record.UserId)
      .filter(id => id && mongoose.Types.ObjectId.isValid(id))
    )];

    console.log("Unique UserIds found:", userIds.length);

    // Fetch all users in one query
    let users = [];
    if (userIds.length > 0) {
      users = await User.find({
        _id: { $in: userIds }
      }).lean();
    }

    console.log("Users fetched:", users.length);

    // Create user lookup map
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user;
    });

    // Transform data with user information using Employer field as ETF
    const transformedData = etfRecords.map(epfRecord => {
      // Find user by UserId
      const user = userMap[epfRecord.UserId?.toString()];

      // Debug log for first record
      if (epfRecord === etfRecords[0]) {
        console.log("First EPF record for ETF details:", {
          epfId: epfRecord._id,
          UserId: epfRecord.UserId,
          EmployeeId: epfRecord.EmployeeId,
          Employer: epfRecord.Employer, // This becomes ETF
          Employee: epfRecord.Employee,
          userFound: !!user,
          userName: user?.name
        });
      }

      return {
        _id: epfRecord._id,
        employeeId: epfRecord.EmployeeId || user?.empId || 'N/A',
        employeeName: user?.name || 'Name Not Found',
        basicSalary: parseInt(user?.basicSal) || 0,
        role: user?.role || 'Role Not Found',
        ETF: epfRecord.Employer || 0, // Using Employer field as ETF contribution
        createdAt: epfRecord.createdAt,
        userId: user?._id || null,
        userFound: !!user
      };
    });

    console.log("Final transformed ETF data count:", transformedData.length);
    console.log("Sample transformed ETF record:", transformedData[0]);

    // Count records with and without user data
    const withUserData = transformedData.filter(item => item.userFound);
    const withoutUserData = transformedData.filter(item => !item.userFound);

    console.log("Records with user data:", withUserData.length);
    console.log("Records without user data:", withoutUserData.length);

    res.status(200).json({ 
      etfData: transformedData,
      totalRecords: transformedData.length,
      recordsWithUserData: withUserData.length,
      recordsWithoutUserData: withoutUserData.length,
      dateRange: { startDate, endDate },
      month: getMonthName(monthInt),
      year: yearInt
    });

  } catch (error) {
    console.error("Error in getEtfModelData:", error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server Error'
    });
  }
});

// Helper function to get month name
function getMonthName(monthNumber) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1] || 'Unknown';
}

// Alternative API using aggregation with EPFModel Employer field as ETF
router.get('/getEtfModelDataAggregated/:month/:year', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor'), async (req, res) => {
  const { month, year } = req.params;
  
  try {
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);
    
    // Create proper date range
    const startDate = new Date(yearInt, monthInt - 1, 1);
    const endDate = new Date(yearInt, monthInt, 0, 23, 59, 59, 999);

    console.log("ETF Aggregation (using EPFModel) - Date range:", startDate.toISOString(), "to", endDate.toISOString());

    const result = await EPFModel.aggregate([
      // Match EPF records in date range with Employer (ETF) contributions
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          Employer: { $gt: 0 } // Using Employer field as ETF
        }
      },
      // Convert UserId to ObjectId if it's a string
      {
        $addFields: {
          userObjectId: {
            $cond: {
              if: { $type: "$UserId" },
              then: { $toObjectId: "$UserId" },
              else: "$UserId"
            }
          }
        }
      },
      // Lookup user data using UserId field
      {
        $lookup: {
          from: 'users',
          localField: 'userObjectId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      // Get the first user from the array
      {
        $addFields: {
          user: { $arrayElemAt: ["$userDetails", 0] }
        }
      },
      // Project final structure with Employer field as ETF
      {
        $project: {
          _id: 1,
          employeeId: {
            $ifNull: ["$EmployeeId", "$user.empId", "N/A"]
          },
          employeeName: {
            $ifNull: ["$user.name", "Name Not Found"]
          },
          basicSalary: {
            $cond: {
              if: { $ne: ["$user.basicSal", null] },
              then: { $toInt: "$user.basicSal" },
              else: 0
            }
          },
          role: {
            $ifNull: ["$user.role", "Role Not Found"]
          },
          ETF: { $ifNull: ["$Employer", 0] }, // Using Employer field as ETF contribution
          createdAt: 1,
          userFound: { $ne: ["$user", null] }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    console.log("ETF Aggregated result count (using EPFModel):", result.length);
    if (result.length > 0) {
      console.log("Sample ETF aggregated record (using EPFModel):", result[0]);
    }

    if (result.length === 0) {
      return res.status(404).json({ 
        message: `No ETF data found for ${getMonthName(monthInt)} ${yearInt}.`
      });
    }

    res.status(200).json({ 
      etfData: result,
      totalRecords: result.length,
      recordsWithUserData: result.filter(item => item.userFound).length,
      recordsWithoutUserData: result.filter(item => !item.userFound).length,
      month: getMonthName(monthInt),
      year: yearInt
    });

  } catch (error) {
    console.error("ETF Aggregation error:", error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: error.message
    });
  }
});

// Debug endpoint to check what EPF data exists for ETF
router.get('/debugEtfDates', verifyToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    // Get all EPF records with their dates (for ETF report)
    const allRecords = await EPFModel.find({}, { 
      createdAt: 1, 
      UserId: 1, 
      EmployeeId: 1, 
      Employee: 1,
      Employer: 1 // This becomes ETF
    }).sort({ createdAt: -1 }).limit(20).lean();

    // Group by month/year
    const dateGroups = {};
    allRecords.forEach(record => {
      const date = new Date(record.createdAt);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!dateGroups[monthYear]) {
        dateGroups[monthYear] = [];
      }
      dateGroups[monthYear].push(record);
    });

    res.json({
      totalRecords: await EPFModel.countDocuments(),
      recentRecords: allRecords,
      dateGroups: Object.keys(dateGroups).map(monthYear => ({
        monthYear,
        count: dateGroups[monthYear].length,
        hasEmployer: dateGroups[monthYear].filter(r => r.Employer > 0).length, // Employer as ETF
        hasEmployee: dateGroups[monthYear].filter(r => r.Employee > 0).length
      }))
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Additional helper endpoint to check available ETF dates (using EPFModel)
router.get('/getAvailableEtfDates', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor'), async (req, res) => {
  try {
    const availableDates = await EPFModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 },
          withETF: {
            $sum: { $cond: [{ $gt: ["$Employer", 0] }, 1, 0] } // Employer as ETF
          },
          withEmployee: {
            $sum: { $cond: [{ $gt: ["$Employee", 0] }, 1, 0] }
          },
          minDate: { $min: "$createdAt" },
          maxDate: { $max: "$createdAt" }
        }
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 }
      }
    ]);
    res.status(200).json({ availableDates });
  } catch (error) {
    console.error("Error getting available ETF dates:", error);
    res.status(500).json({ message: 'Error fetching available ETF dates' });
  }
});

// Debug endpoint to check EPF model structure for ETF usage
router.get('/debugEtfModel', verifyToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const sampleRecord = await EPFModel.findOne().lean();
    const totalCount = await EPFModel.countDocuments();
    const employerCount = await EPFModel.countDocuments({ Employer: { $gt: 0 } });
    
    res.status(200).json({
      totalRecords: totalCount,
      recordsWithEmployer: employerCount, // Records suitable for ETF
      sampleRecord: sampleRecord,
      modelFields: sampleRecord ? Object.keys(sampleRecord) : [],
      note: "Using EPFModel with Employer field as ETF contribution"
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ message: 'Debug error' });
  }
});



///


// Route to get payroll data for all employees for a specific month and year
router.get('/payroll/:year/:month', async (req, res) => {
  console.log("Route called: /api/users/payroll");

  try {
    const { year, month } = req.params;

    // Validate year and month
    const yearNum = parseInt(year);
    const monthNum = parseInt(month) - 1; // JS months: 0-based
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 0 || monthNum > 11) {
      return res.status(400).json({ error: 'Invalid year or month' });
    }

    // Sri Lanka time: UTC+5:30
    const startDate = new Date(yearNum, monthNum, 1, 5, 30);
    const endDate = new Date(yearNum, monthNum + 1, 0, 5, 30, 59, 999);

    // Fetch data
    const users = await User.find();

    const payments = await Payments.find({
      updatedAt: { $gte: startDate, $lte: endDate },
      states: "true"
    });

    console.log(`payments are ${payments}`);

    const epfData = await EPFModel.find();
    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    });

    const daysInMonth = endDate.getDate();

    const payrollData = [];
    let totalNetSalary = 0,
        totalEmployeeEPF = 0,
        totalEmployerEPF = 0,
        totalEmployeeETF = 0,
        totalAllowance = 0,
        totalServiceCharge = 0,
        totalNoPayAmount = 0,
        totalBasicSalary = 0;

    for (const user of users) {

      //console.log(`Processing user: ${user.name} (${user._id})`);
      console.log(`payments: ${payments}`);
      // Match payment for this user
      const userPayment = payments.find(
        p => p.userId && user._id && p.userId.toString() === user._id.toString()
      );

      const allowance = userPayment ? Number(userPayment.allowance) || 0 : 0;
      const serviceCharge = userPayment ? Number(userPayment.serviceCharge) || 0 : 0;

      // Match EPF for this user
      const userEPF = epfData.find(
        e => e.UserId && e.UserId.toString() === user._id.toString()
      );
      const employeeEPF = userEPF ? Number(userEPF.Employee) || 0 : 0;
      const employerEPF = userEPF ? Number(userEPF.Employer) || 0 : 0;
      const employeeETF = userEPF ? Number(userEPF.Employee) || 0 : 0;

      // Attendance
      const userAttendance = attendance.filter(
        a => a.userId && a.userId.toString() === user._id.toString()
      );
      const presentDays = userAttendance.filter(a => a.status === 'Present').length;
      const noPayDays = daysInMonth - presentDays;

      const basicSalary = Number(user.basicSal) || 0;
      const dailyRate = daysInMonth > 0 ? basicSalary / daysInMonth : 0;
      const noPayAmount = noPayDays * dailyRate;

      const totalEarnings = basicSalary + allowance + serviceCharge;

      const calculatedEmployeeEPF = employeeEPF || basicSalary * 0.08;
      const calculatedEmployerEPF = employerEPF || basicSalary * 0.12;
      const calculatedEmployeeETF = employeeETF || basicSalary * 0.03;

      const netSalary = totalEarnings - noPayAmount - calculatedEmployeeEPF;

      payrollData.push({
        empId: user.CorrectuserId || 'N/A',
        empName: user.name || 'Unknown',
        jobRole: user.role || 'N/A',
        empType: user.empType || 'N/A',
        basicSalary,
        allowance,
        serviceCharge,
        noPay: noPayAmount,
        employeeEPF: calculatedEmployeeEPF,
        employerEPF: calculatedEmployerEPF,
        employeeETF: calculatedEmployeeETF,
        netSalary
      });

      // Totals
      totalBasicSalary += basicSalary;
      totalNetSalary += netSalary;
      totalEmployeeEPF += calculatedEmployeeEPF;
      totalEmployerEPF += calculatedEmployerEPF;
      totalEmployeeETF += calculatedEmployeeETF;
      totalAllowance += allowance;
      totalServiceCharge += serviceCharge;
      totalNoPayAmount += noPayAmount;
    }

    // Final response
    res.json({
      payroll: payrollData,
      summations: {
        totalBasicSalary,
        totalNetSalary,
        totalEmployeeEPF,
        totalEmployerEPF,
        totalEmployeeETF,
        totalAllowance,
        totalServiceCharge,
        totalNoPayAmount
      }
    });

  } catch (error) {
    console.error('Payroll Error:', error.message, error.stack);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});



//////////////

router.get('/leaves/:year/:month', async (req, res) => {
  try {
    // Extract year and month from URL parameters
    const { year, month } = req.params;

    // Validate year and month
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(yearNum) || isNaN(monthNum)) {
      return res.status(400).json({ error: 'Year and month must be valid numbers' });
    }

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ error: 'Month must be between 1 and 12' });
    }

    if (yearNum < 2000 || yearNum > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'Year must be between 2000 and next year' });
    }

    // Convert month and year to date range for filtering
    const startDate = new Date(yearNum, monthNum - 1, 1); // First day of the month
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999); // Last millisecond of the month

    console.log('Date Range:', { startDate, endDate });

    // Debugging: Check collection data
    const leaveDataCount = await LeaveData.countDocuments({
      $and: [
        {
          LeaveStartDate: {
            $gte: startDate,
          },
        },
        {
          LeaveEndDate: {
            $lte: endDate,
          },
        },
      ],
    });

    console.log('LeaveData Count:', leaveDataCount);

    // Debugging: Sample data from LeaveData
    const sampleLeave = await LeaveData.findOne({
      $and: [
        {
          LeaveStartDate: {
            $gte: startDate,
          },
        },
        {
          LeaveEndDate: {
            $lte: endDate,
          },
        },
      ],
    });

    console.log('Sample LeaveData:', sampleLeave);

    // Debugging: Distinct CorrectuserIds
    const distinctCorrectuserIds = await LeaveData.distinct('CorrectuserId', {
      $and: [
        {
          LeaveStartDate: {
            $gte: startDate,
          },
        },
        {
          LeaveEndDate: {
            $lte: endDate,
          },
        },
      ],
    });
    console.log('Distinct CorrectuserIds:', distinctCorrectuserIds);

    // Aggregation 1: Group by CorrectuserId, count leaves, include role
    const leaveSummary = await LeaveData.aggregate([
      // Step 1: Filter by date range
      {
        $match: {
          $expr: {
            $and: [
              {
                $gte: [
                  { $dateFromString: { dateString: '$LeaveStartDate', onError: '$LeaveStartDate' } },
                  startDate,
                ],
              },
              {
                $lte: [
                  { $dateFromString: { dateString: '$LeaveEndDate', onError: '$LeaveEndDate' } },
                  endDate,
                ],
              },
            ],
          },
        },
      },
      // Step 2: Group by CorrectuserId, count leaves, include role and name
      {
        $group: {
          _id: '$CorrectuserId',
          role: { $first: '$Role' },
          name: { $first: '$Name' },
          count: { $sum: 1 },
        },
      },
      // Step 3: Project desired fields
      {
        $project: {
          CorrectuserId: '$_id',
          role: 1,
          name: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Aggregation 2: Find max and min leave counts
    const maxMinLeaves = await LeaveData.aggregate([
      // Step 1: Filter by date range
      {
        $match: {
          $expr: {
            $and: [
              {
                $gte: [
                  { $dateFromString: { dateString: '$LeaveStartDate', onError: '$LeaveStartDate' } },
                  startDate,
                ],
              },
              {
                $lte: [
                  { $dateFromString: { dateString: '$LeaveEndDate', onError: '$LeaveEndDate' } },
                  endDate,
                ],
              },
            ],
          },
        },
      },
      // Step 2: Group by CorrectuserId to count leaves
      {
        $group: {
          _id: '$CorrectuserId',
          name: { $first: '$Name' },
          count: { $sum: 1 },
        },
      },
      // Step 3: Sort by count to find max and min
      {
        $sort: {
          count: -1, // Descending for max
        },
      },
      // Step 4: Project max and min in one document
      {
        $group: {
          _id: null,
          maxLeaves: { $first: { CorrectuserId: '$_id', name: '$name', count: '$count' } },
          minLeaves: { $last: { CorrectuserId: '$_id', name: '$name', count: '$count' } },
        },
      },
      // Step 5: Project final fields
      {
        $project: {
          _id: 0,
          maxLeavesCorrectuserId: '$maxLeaves.CorrectuserId',
          maxLeavesName: '$maxLeaves.name',
          maxLeavesCount: '$maxLeaves.count',
          minLeavesCorrectuserId: '$minLeaves.CorrectuserId',
          minLeavesName: '$minLeaves.name',
          minLeavesCount: '$minLeaves.count',
        },
      },
    ]);

    console.log('Leave Summary:', leaveSummary);
    console.log('Max/Min Leaves:', maxMinLeaves);

    // Combine results
    const response = {
      success: true,
      data: {
        leaveSummary: leaveSummary,
        maxLeaves: maxMinLeaves[0]?.maxLeavesCorrectuserId
          ? {
              CorrectuserId: maxMinLeaves[0].maxLeavesCorrectuserId,
              name: maxMinLeaves[0].maxLeavesName,
              count: maxMinLeaves[0].maxLeavesCount,
            }
          : null,
        minLeaves: maxMinLeaves[0]?.minLeavesCorrectuserId
          ? {
              CorrectuserId: maxMinLeaves[0].minLeavesCorrectuserId,
              name: maxMinLeaves[0].minLeavesName,
              count: maxMinLeaves[0].minLeavesCount,
            }
          : null,
      },
    };

    // Return the result
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in leave aggregation:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message,
    });
  }
});


// Description: Get advance payment report with CorrectuserId, Name, Role, Salary, and total salary
router.get('/advances/:year/:month', async (req, res) => {
  try {
    // Extract year and month from URL parameters
    const { year, month } = req.params;

    // Validate year and month
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(yearNum) || isNaN(monthNum)) {
      return res.status(400).json({ error: 'Year and month must be valid numbers' });
    }

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ error: 'Month must be between 1 and 12' });
    }

    if (yearNum < 2000 || yearNum > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'Year must be between 2000 and next year' });
    }

    // Convert month and year to date range for filtering
    const startDate = new Date(yearNum, monthNum - 1, 1); // First day of the month
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999); // Last millisecond of the month

    console.log('Date Range:', { startDate, endDate });

    // Debugging: Check collection data
    const userCount = await User.countDocuments();
    const middleSalCount = await MiddleSal.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    console.log('Collection Counts:', { userCount, middleSalCount });

    // Debugging: Sample data
    const sampleMiddleSal = await MiddleSal.findOne({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    console.log('Sample MiddleSal:', sampleMiddleSal);

    // Debugging: Distinct Uids
    const distinctUids = await MiddleSal.distinct('Uid', {
      createdAt: { $gte: startDate, $lte: endDate },
    });
    console.log('Distinct Uids:', distinctUids);

    // Aggregation: Join MiddleSal and User, filter by date, sum salaries
    const result = await MiddleSal.aggregate([
      // Step 1: Filter by date range
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      // Step 2: Lookup User records
      {
        $lookup: {
          from: 'users', // Adjust to your actual collection name
          let: { uid: '$Uid' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$_id' }, '$$uid'], // Convert User._id to string
                },
              },
            },
            {
              $project: {
                CorrectuserId: 1,
              },
            },
          ],
          as: 'userData',
        },
      },
      // Step 3: Unwind userData
      {
        $unwind: {
          path: '$userData',
          preserveNullAndEmptyArrays: true, // Keep MiddleSal records even if no User match
        },
      },
      // Step 4: Project desired fields
      {
        $project: {
          CorrectuserId: { $ifNull: ['$userData.CorrectuserId', 'Unknown'] },
          Name: 1,
          Role: 1,
          Salary: { $toDouble: '$Salary' }, // Convert string Salary to number
        },
      },
      // Step 5: Group to collect records and sum salaries
      {
        $group: {
          _id: null,
          advances: {
            $push: {
              CorrectuserId: '$CorrectuserId',
              Name: '$Name',
              Role: '$Role',
              Salary: '$Salary',
            },
          },
          totalSalary: { $sum: '$Salary' },
        },
      },
      // Step 6: Project final output
      {
        $project: {
          _id: 0,
          advances: 1,
          totalSalary: 1,
        },
      },
    ]);

    console.log('Aggregation Result:', result);

    // Return the result
    res.status(200).json({
      success: true,
      data: result[0] || { advances: [], totalSalary: 0 },
    });
  } catch (error) {
    console.error('Error in advance payment aggregation:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message,
    });
  }
});


// Helper function to generate random outTime between 11:00 PM and 11:30 PM UTC
const generateRandomOutTime = (createdAt) => {
  const date = new Date(createdAt);
  // Set time to random between 11:00:00 PM and 11:30:00 PM UTC
  const minutes = Math.floor(Math.random() * 31); // 0 to 30 minutes
  const seconds = Math.floor(Math.random() * 60); // 0 to 59 seconds
  date.setUTCHours(23, minutes, seconds, 0); // 11:XX:XX PM UTC
  const hours = date.getUTCHours();
  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = seconds.toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; // Convert to 12-hour format
  return `${hours12}:${minutesStr}:${secondsStr} ${ampm}`;
};

// Route: GET /api/users/attendance/:year/:month/:userId
// Description: Get attendance report for a specific user, year, and month
router.get('/attendance/:year/:month/:userId', async (req, res) => {
  try {
    const { year, month, userId } = req.params;

    // Validate inputs
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(yearNum) || isNaN(monthNum)) {
      return res.status(400).json({ error: 'Year and month must be valid numbers' });
    }

    if (monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ error: 'Month must be between 1 and 12' });
    }

    if (yearNum < 2000 || yearNum > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'Year must be between 2000 and next year' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'UserId is required' });
    }

    // Date range for filtering
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    console.log('Parameters:', { year, month, userId });
    console.log('Date Range:', { startDate, endDate });

    // Find User
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: `User with CorrectuserId ${userId} not found` });
    }
    const userIdString = user._id.toString();

    console.log('Found User:', { CorrectuserId: user.CorrectuserId, _id: userIdString });

    // Aggregation
    const result = await Attendance.aggregate([
      {
        $match: {
          userId: userIdString,
          date: { $gte: startDate, $lte: endDate }, // Filter on 'date' field
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: '$_id' }, '$$userId'],
                },
              },
            },
            {
              $project: {
                CorrectuserId: 1,
              },
            },
          ],
          as: 'userData',
        },
      },
      {
        $unwind: {
          path: '$userData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          name: 1,
          date: 1,
          time: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
          CorrectuserId: { $ifNull: ['$userData.CorrectuserId', 'Unknown'] },
        },
      },
      {
        $sort: {
          date: 1, // Sort by date instead of createdAt
        },
      },
    ]);

    // Add outTime
    const resultWithOutTime = result.map((record) => ({
      ...record,
      outTime: generateRandomOutTime(record.date), // Use 'date' for outTime
    }));

    console.log('Aggregation Result with outTime:', resultWithOutTime);

    res.status(200).json({
      success: true,
      data: resultWithOutTime,
    });
  } catch (error) {
    console.error('Error in attendance aggregation:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message,
    });
  }
});


router.get(
  '/middle-salary/:userId',
  verifyToken,
  authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor'),
  async (req, res) => {
    try {
      const { userId } = req.params;

      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      // Step 1: Get middle salary records for this user in the current month
      const middleSalaryData = await MiddleSal.find({
        Uid: userId,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      }).lean();

      if (middleSalaryData.length === 0) {
        return res.status(404).json({ message: 'No middle salary data found for this user this month.' });
      }

      // Step 2: Get the user by ID
      const user = await User.findById(userId).lean();
      const correctUserId = user ? user.CorrectuserId : null;

      // Step 3: Add CorrectuserId (as EmpId or similar) to each salary entry
      const enrichedData = middleSalaryData.map(salary => ({
        ...salary,
        EmpId: correctUserId
      }));

      res.status(200).json(enrichedData);
    } catch (error) {
      console.error('Error fetching middle salary data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);


//Get the LeaveData for a specific user
router.get('/leave-data/:userId', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor'), async (req, res) => {
  const { userId } = req.params;

  const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  try {
    const leaveData = await LeaveData.find({CorrectuserId: userId, createdAt: { $gte: startOfMonth, $lte: endOfMonth } }).lean();

    if (!leaveData || leaveData.length === 0) {
      return res.status(404).json({ message: 'No leave data found for this user.' });
    }

    res.status(200).json(leaveData);
  } catch (error) {
    console.error('Error fetching leave data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



//get the halfday data for a specific user
router.get('/halfday-data/:userId', verifyToken, authorizeRoles('Admin', 'Manager', 'Headchef', 'Subchef', 'Supervisor'), async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId }).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const halfDayData = await HalfDay.find({
      userId: user._id,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    }).lean();

    // Build the array response
    const responseArray = halfDayData.map((entry) => ({
      ...entry,
      EmpID: user.CorrectuserId || 'N/A',
      EmpName: user.name || 'Name Not Found',
    }));

    res.status(200).json(responseArray);
  } catch (error) {
    console.error('Error fetching user with half-day data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports=router;