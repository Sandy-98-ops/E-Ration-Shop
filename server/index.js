import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

import retailerRouter from "./routes/RetailerRouter.js";
import distributorRoute from "./routes/DistributorRouter.js";
import citizenRoutes from "./routes/CitizenRouter.js";
import itemRouter from "./routes/ItemRouter.js";
import stockRouter from "./routes/StockRouter.js";
import saleRouter from "./routes/SaleRouter.js";
import notificationRouter from "./routes/NotificationsRouter.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Connect to MongoDB
const URL = process.env.MONGOURL; // Updated to match.env variable
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB Connected Successfully");
    })
    .catch(error => console.error("DB Connection Error:", error));

// Serve static files from the uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, 'uploads');

console.log(uploadDirectory);

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory); // Set destination to your uploadDirectory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const upload = multer({ storage });

// Middleware to serve static files
app.use('/citizen', citizenRoutes);
app.use('/retailer', retailerRouter);
app.use('/distributor', distributorRoute);
app.use('/items', itemRouter);
app.use('/stock', stockRouter);
app.use('/sale', saleRouter);
app.use("/notification", notificationRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
});