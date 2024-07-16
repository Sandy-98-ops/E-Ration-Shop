import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({

    retailer: {
        type: Schema.Types.ObjectId, // Referencing another model
        ref: 'Retailer', // Name of the model being referenced
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
    }
})

export default mongoose.model("Items", itemSchema);