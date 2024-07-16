import mongoose, { Schema } from "mongoose";

const stockSchema = new Schema({

    retailer: {
        type: Schema.Types.ObjectId, // Referencing another model
        ref: 'Retailer', // Name of the model being referenced
        required: true
    },
    issueDate: {
        type: String,
        required: true
    },
    wheat: {
        type: Number,
    },
    rice: {
        type: Number,
    },
    sugar: {
        type: Number,
    },
    citizenCount: {
        type: Number
    },
    totalWheat: {
        type: Number
    },
    totalRice: {
        type: Number
    },
    totalSugar: {
        type: Number
    },
    remainingWheat: {
        type: Number
    },
    remainingRice: {
        type: Number
    },
    remainingSugar: {
        type: Number
    },
    issued: {
        type: Boolean
    }
})

export default mongoose.model("Stock", stockSchema);