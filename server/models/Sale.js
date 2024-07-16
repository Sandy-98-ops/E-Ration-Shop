import mongoose, { Schema } from "mongoose";


const saleSchema = new Schema({
    citizen: {
        type: Schema.Types.ObjectId, // Referencing another model
        ref: 'Citizen', // Name of the model being referenced
        required: true
    },
    retailer: {
        type: Schema.Types.ObjectId, // Referencing another model
        ref: 'Retailer', // Name of the model being referenced
        required: true
    },
    rice: {
        type: Number
    },
    wheat: {
        type: Number
    },
    sugar: {
        type: Number
    },
    date: {
        type: String
    },
    issued: {
        type: Boolean
    }
})

export default mongoose.model("Sale", saleSchema);