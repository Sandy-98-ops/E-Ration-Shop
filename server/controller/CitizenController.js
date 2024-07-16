import Citizen from '../models/Citizen.js';
import mongoose from 'mongoose';
import { sendWelcomeEmail } from '../utils/EmailService.js';
import bcrypt from 'bcrypt';

const { isValidObjectId } = mongoose;

export const create = async (req, res) => {

    const citizen = new Citizen(req.body);

    try {
        const rationCardNo = citizen.rationCardNo;

        const existingCitizen = await Citizen.findOne({ rationCardNo })

        if (existingCitizen) {
            return res.status(400).json({ message: 'Ration Card No already exists' });
        }

        sendWelcomeEmail(citizen.email, citizen.firstName);
        return res.status(200)
            .json(await citizen.save());
    } catch (error) {
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }

};


export const getCitizens = async (req, res) => {
    try {
        const institute = req.params.id;

        const citizens = await Citizen.find();

        if (!citizens || citizens.length === 0) {
            return res.status(404).json({ message: "No Citizens found" });
        }

        return res.status(200).json(citizens);

    } catch (error) {
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}

export const getCitizenById = async (req, res) => {
    try {
        const id = req.params.id;

        if (id) {
            const citizen = await Citizen.findById(id);
            if (!citizen) {
                return res.status(400)
                    .json({ message: "Citizen not Found" });
            }
            return res.status(200)
                .json(citizen);
        }

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const getCitizensByRetailerId = async (req, res) => {
    try {
        const { retailer } = req.params;

        const citizen = await Citizen.find({ retailer });

        if (!citizen) {
            return res.status(400)
                .json({ message: "Citizen not Found" });
        }

        return res.status(200)
            .json(citizen);

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const getCitizenByRationCarNoAndRetailer = async (req, res) => {
    try {

        // Extracting query parameters
        const { rationCardNo, retailer } = req.body;

        // Ensure both query parameters are provided
        if (!rationCardNo || !retailer) {
            return res.status(400).json({ message: "Missing required query parameters: rationCardNo" });
        }

        // Convert retailer to ObjectId
        const retailerObjectId = new mongoose.Types.ObjectId(retailer);

        // Finding the citizen based on ration card number and retailer
        const citizen = await Citizen.findOne({ rationCardNo, retailer: retailerObjectId });

        // If no citizen found, send a 400 response
        if (!citizen) {
            return res.status(400).json({ message: "Citizen not Found" });
        }

        // Logging the found citizen

        // Sending the found citizen as a response
        return res.status(200).json(citizen);

    } catch (error) {
        // Logging the error and sending a 500 response
        console.error(error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
};


export const updateCitizenById = async (req, res) => {
    try {

        const id = req.params.id;

        const citizen = req.body;

        if (citizen) {
            await Citizen.findByIdAndUpdate(id, citizen, { new: true });

            return res.status(200)
                .json({ message: "Data Updated Successfully" });
        }

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const deleteCitizenById = async (req, res) => {
    try {
        const id = req.params.id;

        await Citizen.findByIdAndDelete(id);

        return res.status(200)
            .json({ message: "Record deleted successfully" })

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const citizenLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const citizen = await Citizen.findOne({ email });

        if (!citizen) {
            return res.status(404)
                .json({ message: "Citizen not found" });
        }

        const isMatch = await bcrypt.compare(password, citizen.password);

        if (!isMatch) {
            return res.status(401).
                json({ message: "Invalid Credentials", status: 0 })
        }

        return res.status(200).
            json({ citizen })

    } catch (error) {
        return res.status(500)
            .json({ message: `Server Error ${error}` })
    }
}

export const changeCitizenPassword = async (req, res) => {

    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;

    try {
        const citizen = await Citizen.findById(id)

        if (!citizen) {
            return res.status(404)
                .json({ message: "User not found" });
        }

        const isMatch = await
            bcrypt.compare(oldPassword, citizen.password);

        if (!isMatch) {
            return res.status(401)
                .json({ message: "Entered password is wrong" });
        }

        citizen.password = newPassword;

        await citizen.save();

        return res.status(200)
            .json({
                message: "Password Changed Successfully :"
            });

    } catch (error) {
        return res.status(500)
            .json({ message: `Server error: ${error}` })
    }

}

export const forgotPassword = async (req, res) => {

    const { email } = req.params;

    const pwd = generateRandomText(8);

    const citizen = await Citizen.findOne({ email });

    if (!citizen) {
        return res.status(404).
            json({ message: "User not found" });
    }

    citizen.password = pwd;

    await Citizen.findByIdAndUpdate(citizen._id, citizen, { new: true });

    sendForgotPasswordEmail(citizen.email, citizen.firstName, pwd);

    return res.status(200)
        .json({ message: "Password sent Successfully " })
}