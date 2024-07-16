import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";

const distributorSchema = new Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
        min: 3
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    address : {
        type : String
    },
    password: {
        type: String,
        required: true
    }
});

distributorSchema.pre('save', async function () {
    try {
        const userData = this;
        const saltRounds = 10;

        if (userData.isModified('password')) {
            userData.password =
                await bcrypt.hash(userData.password, saltRounds);
        }
    } catch (error) {
        throw error;
    }
});

// Middleware to hash password before updating
distributorSchema.pre('findOneAndUpdate', async function () {
    try {
        const userData = this.getUpdate(); // `this` refers to the query object
        const saltRounds = 10;

        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, saltRounds);
        }
    } catch (error) {
        throw error;
    }
});

export default mongoose.model("Distributor", distributorSchema);