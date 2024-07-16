import bcrypt from 'bcrypt'
import Distributor from '../models/DistributorModel.js';
import { sendDistributorCreationMail, sendForgotPasswordEmail } from '../utils/EmailService.js';
import { generateRandomText } from '../utils/GenerateRandomText.js';

export const createDistributor = async (req, res) => {

    try {

        const distributor = new Distributor(req.body)

        const email = distributor.email;
        const password = distributor.password;
        const existingDistributor = await Distributor.findOne({ email });

        if (existingDistributor) {
            return res.status(400)
                .json({ message: `Distributor already Exists` });
        }

        await distributor.save();

        sendDistributorCreationMail(distributor.email, distributor.firstName, password);

        return res.status(200)
            .json({ message: "Registered Successfully" });

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const getAllDistributors = async (req, res) => {

    try {
        return res.status(200).json(await Distributor.find());

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const getDistributorById = async (req, res) => {
    try {
        const id = req.params.id;

        if (id) {
            const distributor = await Distributor.findById(id);
            if (!distributor) {
                return res.status(400)
                    .json({ message: "Distributor not Found" });
            }
            return res.status(200)
                .json(distributor);
        }

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const updateDistributorById = async (req, res) => {
    try {

        const id = req.params.id;

        const distributor = req.body;

        if (distributor) {
            await Distributor.findByIdAndUpdate(id, distributor, { new: true });

            return res.status(200)
                .json({ message: "Data Updated Successfully" });
        }

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const deleteDistributorById = async (req, res) => {
    try {
        const id = req.params.id;

        await Distributor.findByIdAndDelete(id);

        return res.status(200)
            .json({ message: "Record deleted successfully" })

    } catch (error) {
        return res.status(500)
            .json({ message: `Internal Server Error: ${error}` });
    }
}

export const distributorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const distributor = await Distributor.findOne({ email });

        if (!distributor) {
            return res.status(404)
                .json({ message: "Distributor not found" });
        }

        const isMatch = await bcrypt.compare(password, distributor.password);

        if (!isMatch) {
            return res.status(401).
                json({ message: "Invalid Credentials", status: 0 })
        }

        return res.status(200).
            json({ distributor })

    } catch (error) {
        return res.status(500)
            .json({ message: `Server Error ${error}` })
    }
}

export const changeDistributorPassword = async (req, res) => {

    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;

    try {
        const distributor = await Distributor.findById(id)

        if (!distributor) {
            return res.status(404)
                .json({ message: "User not found" });
        }

        const isMatch = await
            bcrypt.compare(oldPassword, distributor.password);

        if (!isMatch) {
            return res.status(401)
                .json({ message: "Entered password is wrong" });
        }

        distributor.password = newPassword;

        await distributor.save();

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

    const distributor = await Distributor.findOne({ email });

    if (!distributor) {
        return res.status(404).
            json({ message: "User not found" });
    }

    distributor.password = pwd;

    await Distributor.findByIdAndUpdate(distributor._id, distributor, { new: true });

    sendForgotPasswordEmail(distributor.email, distributor.firstName, pwd);

    return res.status(200)
        .json({ message: "Password sent Successfully " })
}