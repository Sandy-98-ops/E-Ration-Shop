import express from "express"
import { createNotification, deleteNotificationById, getAllNotifications, updateNotificationById } from "../controller/NotificationController.js";

const notificationRouter = express.Router();

notificationRouter.post("/createNotification", createNotification);
notificationRouter.get("/", getAllNotifications);
notificationRouter.put("/updateNotificationById/:id", updateNotificationById);
notificationRouter.delete("/deleteNotificationById/:id", deleteNotificationById);

export default notificationRouter;