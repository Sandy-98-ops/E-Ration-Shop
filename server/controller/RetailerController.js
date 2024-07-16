import Retailer from "../models/RetailerModel.js"
import bcrypt from 'bcrypt'
import { sendRetailerCreationMail } from "../utils/EmailService.js";

export const createRetailer = async (req, res) => {

    try {

        const retailer = new Retailer(req.body);

        const password = req.body;

        if (!retailer) {
            return res.status(400)
                .json({ message: "Nothing to save" });
        }

        const email = retailer.email;

        const existingRetailer = await Retailer.findOne({ email });

        if (existingRetailer) {
            return res.status(400)
                .json({ message: `Retailer already Exists` });
        }

        await retailer.save();

        sendRetailerCreationMail(retailer, password)

        return res.status(200)
            .json({ message: "Registered Successfully" });

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const getAllRetailers = async (req, res) => {

    try {
        return res.status(200).json(await Retailer.find());

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const getRetailerById = async (req, res) => {
    try {
        const id = req.params.id;

        if (id) {
            const retailer = await Retailer.findById(id);
            if (!retailer) {
                return res.status(400)
                    .json({ message: "Retailer not Found" });
            }
            return res.status(200)
                .json(retailer);
        }

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}



export const updateRetailerById = async (req, res) => {
    try {

        const id = req.params.id;

        const retailer = req.body;

        if (retailer) {
            await Retailer.findByIdAndUpdate(id, retailer, { new: true });
            return res.status(200)
                .json({ message: "Data Updated Successfully" });
        }

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const deleteRetailerById = async (req, res) => {
    try {

        const id = req.params.id;

        await Retailer.findByIdAndDelete(id);

        return res.status(200)
            .json({ message: "Record deleted successfully" })

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const retailer = await Retailer.findOne({ email });
        if (!retailer) {
            return res.status(404)
                .json({ message: "Retailer not found" });
        }

        const isMatch = await bcrypt.compare(password, retailer.password);

        if (!isMatch) {
            return res.status(401).
                json({ message: "Invalid Credentials", status: 0 })
        }

        return res.status(200).
            json({ retailer })

    } catch (error) {
        return res.status(500)
            .json({ message: `Server Error ${error}` })
    }
}

export const changePassword = async (req, res) => {

    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;

    try {
        const retailer = await Retailer.findById(id)

        if (!retailer) {
            return res.status(404)
                .json({ message: "User not found" });
        }

        const isMatch = await
            bcrypt.compare(oldPassword, retailer.password);

        if (!isMatch) {
            return res.status(401)
                .json({ message: "Entered password is wrong" });
        }

        retailer.password = newPassword;

        await retailer.save();

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

    const citizen = await Retailer.findOne({ email });

    if (!citizen) {
        return res.status(404).
            json({ message: "User not found" });
    }

    citizen.password = pwd;

    await Retailer.findByIdAndUpdate(citizen._id, citizen, { new: true });

    sendForgotPasswordEmail(citizen.email, citizen.firstName, pwd);

    return res.status(200)
        .json({ message: "Password sent Successfully " })
}