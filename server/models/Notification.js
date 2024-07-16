import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema({

    notificationHeading: {
        type: String,
        required: true,
        trim: true
    },
    notificationMessage: {
        type: String,
        required: true,
        trim: true
    },
    active: {
        type: Boolean
    }

});

export default mongoose.model('Notification', notificationSchema);