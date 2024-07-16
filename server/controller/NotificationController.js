import Notification from "../models/Notification.js";

export const createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);

        if (!notification.notificationHeading) {
            return res.status(400).json({ message: 'Please provide notification heading' });
        }

        if (!notification.notificationMessage) {
            return res.status(400).json({ message: 'Please provide notification message' });
        }

        await notification.save();
        return res.status(200).json({ message: 'Notification created successfully' });

    } catch (err) {
        console.error('Error creating category:', err);
        return res.status(500).json({ message: 'An error occurred while processing your request' });
    }
};


export const getAllNotifications = async (req, res) => {
    try {
        return res.status(200).json({ data: await Notification.find() });
    } catch (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({ message: 'An error occurred while processing your request' });
    }
};



export const updateNotificationById = async (req, res) => {

    const { id } = req.params;
    const updateData = req.body;

    try {
        const notification = await Notification.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({ data: notification });

    } catch (error) {
        console.error(error);
        return res.status(500)
            .json({ message: 'Internal server error', error });
    }
}


export const deleteNotificationById = async (req, res) => {
    const { id } = req.params;

    try {
        const notification = await Notification.findByIdAndDelete(id, { new: true });

        return res.status(200).json({ data: notification });

    } catch (error) {
        console.error(error);
        return res.status(500)
            .json({ message: 'Internal server error', error });
    }
}