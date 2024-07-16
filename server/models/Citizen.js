import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";

const citizenSchema = new Schema({

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
        lowercase: true
    },
    address: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    gender: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        unique: true,
        required: true
    },
    rationCardNo: {
        type: String
    },
    retailer: {
        type: Schema.Types.ObjectId, // Referencing another model
        ref: 'Retailer', // Name of the model being referenced
        required: true
    },
});

citizenSchema.pre('save', async function () {
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
citizenSchema.pre('findOneAndUpdate', async function () {
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

export default mongoose.model("Citizen", citizenSchema);