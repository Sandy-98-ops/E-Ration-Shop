import mongoose from 'mongoose';
import Sale from '../models/Sale.js';
import StocksModel from '../models/StocksModel.js';

export const createSale = async (req, res) => {
    try {
        const sale = new Sale(req.body);

        // Check preconditions
        if (!sale.retailer) {
            return res.status(400).json({ message: "Please select Retailer" });
        }

        if (sale.citizenCount === 0) {
            return res.status(400).json({ message: "Citizen Count is 0. Issue sale is not allowed." });
        }

        if (!sale.date) {
            return res.status(400).json({ message: "Please select date." });
        }

        // Extract year and month from the date string
        const [year, month] = sale.date.split('-');

        // Create a regex pattern to match any date within the same year and month
        const datePattern = new RegExp(`^${year}-${month}`);

        // Check for existing sale issued in the same year and month for the same retailer
        const existingSale = await Sale.findOne({
            citizen: sale.citizen,
            date: { $regex: datePattern }
        });

        if (existingSale) {
            return res.status(400).json({ message: "Sale has already been issued for this Citizen in the same month." });
        }

        // Find the previous month's sale record for the same retailer
        const prevMonthDate = new Date(year, month - 1, 1); // Get the first day of the current month
        const prevMonthPattern = new RegExp(`^${prevMonthDate.getFullYear()}-${(prevMonthDate.getMonth() + 1).toString().padStart(2, '0')}`);

        // Fetch current stock for the retailer
        let stock = await StocksModel.findOne({ retailer: sale.retailer }).sort({ issueDate: -1 });

        if (!stock) {
            return res.status(404).json({ message: "No stock found for the retailer." });
        }

        // Check if remaining quantities are sufficient
        if (stock.remainingWheat < sale.wheat || stock.remainingRice < sale.rice || stock.remainingSugar < sale.sugar) {
            return res.status(400).json({ message: "Not enough stock available for the sale." });
        }

        // Deduct sale quantities from stock
        stock.remainingWheat -= sale.wheat || 0;
        stock.remainingRice -= sale.rice || 0;
        stock.remainingSugar -= sale.sugar || 0;

        // Save the updated stock record
        await stock.save();

        // Save the sale record
        await sale.save();

        return res.status(200).json({ message: "Sale added successfully." });

    } catch (error) {
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};




export const getAllSales = async (req, res) => {

    try {
        return res.status(200).json(await Sale.find());

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const getSaleById = async (req, res) => {
    try {
        const id = req.params.id;

        if (id) {
            const sale = await Sale.findById(id);
            if (!sale) {
                return res.status(400)
                    .json({ message: "Sale Master not Found" });
            }
            return res.status(200)
                .json(sale);
        }

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const getSaleByRetailer = async (req, res) => {
    try {
        // Extract the retailer ID from the request parameters
        const retailer = req.params;

        // Check if the retailer ID exists
        if (!retailer) {
            return res.status(400).json({ message: "Retailer ID is required" });
        }

        // Find sales by the retailer's ObjectId
        const sales = await Sale.find(retailer);

        // Check if any sales were found
        if (!sales || sales.length === 0) {
            return res.status(404).json({ message: "Sale Master not found" });
        }

        // Return the found sales
        return res.status(200).json(sales);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};


export const getSaleByCitizen = async (req, res) => {
    try {
        // Extract the retailer ID from the request parameters
        const citizen = req.params;

        // Check if the retailer ID exists
        if (!citizen) {
            return res.status(400).json({ message: "Citizen ID is required" });
        }

        // Find sales by the retailer's ObjectId
        const sales = await Sale.find(citizen);

        // Check if any sales were found
        if (!sales || sales.length === 0) {
            return res.status(404).json({ message: "Sale not found" });
        }

        // Return the found sales
        return res.status(200).json(sales);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
};


export const updateSaleById = async (req, res) => {
    try {

        const id = req.params.id;

        const sale = req.body;

        if (sale) {
            await Sale.findByIdAndUpdate(id, sale, { new: true });
            return res.status(200)
                .json({ message: "Data Updated Successfully" });
        }

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const deleteSaleById = async (req, res) => {
    try {

        const id = req.params.id;

        await Sale.findByIdAndDelete(id);

        return res.status(200)
            .json({ message: "Record deleted successfully" })

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}
