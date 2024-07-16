import mongoose from 'mongoose';
import ItemMaster from '../models/ItemMaster.js';

export const createItem = async (req, res) => {

    try {

        const item = new ItemMaster(req.body);

        if (!item) {
            return res.status(400)
                .json({ message: "Nothing to save" });
        }

        const { retailer } = req.body

        const existingItemMaster = await ItemMaster.findOne({ retailer });

        if (existingItemMaster) {
            return res.status(400)
                .json({ message: `Item Master already Exists` });
        }

        await item.save();

        return res.status(200)
            .json({ message: "Added Successfully" });

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const getAllItems = async (req, res) => {

    try {
        return res.status(200).json(await ItemMaster.find());

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const getItemById = async (req, res) => {
    try {
        const id = req.params.id;

        if (id) {
            const item = await ItemMaster.findById(id);
            if (!item) {
                return res.status(400)
                    .json({ message: "Item Master not Found" });
            }
            return res.status(200)
                .json(item);
        }

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const getItemsByRetailer = async (req, res) => {
    try {
        const retailer = req.params.retailer;
        // const retailerObjectId = new mongoose.Types.ObjectId(retailer);

        if (retailer) {
            const item = await ItemMaster.findOne({ retailer });
            if (!item) {
                return res.status(400)
                    .json({ message: "Item Master not Found" });
            }
            return res.status(200)
                .json(item);
        }

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const updateItemById = async (req, res) => {
    try {

        const id = req.params.id;

        const item = req.body;

        if (item) {
            await ItemMaster.findByIdAndUpdate(id, item, { new: true });
            return res.status(200)
                .json({ message: "Data Updated Successfully" });
        }

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const deleteItemById = async (req, res) => {
    try {

        const id = req.params.id;

        await ItemMaster.findByIdAndDelete(id);

        return res.status(200)
            .json({ message: "Record deleted successfully" })

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}
