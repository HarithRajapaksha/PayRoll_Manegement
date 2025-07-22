import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 

import connectDB from './Src/Config/dbconnect.js';
import authRoutes from './Src/Routes/authRoutes.js';
import userRoutes from './Src/Routes/userRoutes.js';
import EtfPaymentRoute from './Src/Routes/EtfPaymentRoute.js';
import HolidayRoute from './Src/Routes/HolidayRoute.js';


connectDB();
const app = express();

app.use(express.json());
dotenv.config();

// Enable CORS
app.use(cors());


//Routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/etf",EtfPaymentRoute);
app.use("/api/holiday",HolidayRoute);


//Start the server
const PORT = process.env.PORT||5000; ;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

