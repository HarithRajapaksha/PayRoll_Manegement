import express from 'express';
import authorizeRoles from '../Middlewares/roleMiddleware.js';
import verifyToken from '../Middlewares/authMiddleware.js';
import ETFPayment from '../Model/ETFPaymentModel.js';

const router = express.Router();

router.post('/AddETF', verifyToken, authorizeRoles("Admin"), async (req, res) => {
    try {
        const { userId, Month, Year, EMPID, Value } = req.body;

        console.log(userId, Month, Year, EMPID, Value );

        const existingPayment = await ETFPayment.findOne({ userId, Month, Year });

        if (existingPayment) {
            return res.status(400).json({
                message: "ETF payment already exists for this employee in the specified month and year."
            });
        }

        const newPayment = new ETFPayment({ userId, Month, Year, EMPID, Value });
        await newPayment.save();

        res.status(201).json({
            message: "ETF Payment created successfully",
            data: newPayment
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating ETF Payment",
            error: error.message
        });
    }
});

export default router; // ✅ Correct ES Module export
