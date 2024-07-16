import StocksModel from '../models/StocksModel.js';
import mongoose from 'mongoose';
export const createStock = async (req, res) => {
    try {
        const stock = new StocksModel(req.body);

        if (!stock.retailer) {
            return res.status(400).json({ message: "Please select Retailer" });
        }

        if (stock.citizenCount === 0) {
            return res.status(400).json({ message: "Citizen Count is 0. Issue stock is not allowed." });
        }

        if (!stock.issueDate) {
            return res.status(400).json({ message: "Please select date." });
        }

        // Extract year and month from the issueDate string
        const [year, month] = stock.issueDate.split('-');

        // Create a regex pattern to match any date within the same year and month
        const datePattern = new RegExp(`^${year}-${month}`);

        // Check for existing stock issued in the same year and month for the same retailer
        const existingStock = await StocksModel.findOne({
            retailer: stock.retailer,
            issueDate: { $regex: datePattern }
        });

        if (existingStock) {
            return res.status(400).json({ message: "Stock has already been issued for this retailer in the same month." });
        }

        // Find the previous month's stock record for the same retailer
        // Adjust month manually to get the correct previous month
        let prevYear = year;
        let prevMonth = month - 1;

        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear = year - 1;
        }

        // Create the correct regex pattern for the previous month
        const prevMonthPattern = new RegExp(`^${prevYear}-${prevMonth.toString().padStart(2, '0')}`);

        const prevMonthStock = await StocksModel.findOne({
            retailer: stock.retailer,
            issueDate: { $regex: prevMonthPattern }
        }).sort({ issueDate: -1 }) // Sort by issueDate descending
            .limit(1); // Limit to one document

        console.log("Previous Stock", prevMonthStock)

        if (prevMonthStock) {
            // Carry forward remaining quantities
            stock.remainingWheat = (prevMonthStock.remainingWheat || 0) + (stock.totalWheat || 0);
            stock.remainingRice = (prevMonthStock.remainingRice || 0) + (stock.totalRice || 0);
            stock.remainingSugar = (prevMonthStock.remainingSugar || 0) + (stock.totalSugar || 0);
        } else {
            // If no previous month stock, initialize remaining quantities to total quantities
            stock.remainingWheat = stock.totalWheat || 0;
            stock.remainingRice = stock.totalRice || 0;
            stock.remainingSugar = stock.totalSugar || 0;
        }

        await stock.save();

        return res.status(200).json({ message: "Added Successfully" });

    } catch (error) {
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
};



export const getAllStocks = async (req, res) => {

    try {
        return res.status(200).json(await StocksModel.find());

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const getStockById = async (req, res) => {
    try {
        const id = req.params.id;

        if (id) {
            const stock = await StocksModel.findById(id);
            if (!stock) {
                return res.status(400)
                    .json({ message: "Stock Master not Found" });
            }
            return res.status(200)
                .json(stock);
        }

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const getRecentStockByRetailer = async (req, res) => {
    try {
        const retailer = req.params;

        if (!retailer) {
            return res.status(400).json({ message: "Retailer ID is required" });
        }


        const recentStock = await StocksModel.findOne(retailer).sort({ issueDate: -1 });

        if (!recentStock) {
            return res.status(404).json({ message: "No stock records found for this retailer" });
        }

        return res.status(200).json(recentStock);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
};


export const getAllStockByRetailer = async (req, res) => {
    try {
        const retailer = req.params;

        console.log("Entered")

        if (!retailer) {
            return res.status(400).json({ message: "Retailer ID is required" });
        }

        const stock = await StocksModel.find(retailer);

        console.log(stock)
        return res.status(200).json(stock);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
};


export const updateStockById = async (req, res) => {
    try {

        const id = req.params.id;

        const stock = req.body;

        if (stock) {
            await StocksModel.findByIdAndUpdate(id, stock, { new: true });
            return res.status(200)
                .json({ message: "Data Updated Successfully" });
        }

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const deleteStockById = async (req, res) => {
    try {

        const id = req.params.id;

        await StocksModel.findByIdAndDelete(id);

        return res.status(200)
            .json({ message: "Record deleted successfully" })

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}
