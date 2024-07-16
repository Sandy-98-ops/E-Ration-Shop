import express from "express"
import { changePassword, createRetailer, deleteRetailerById, getAllRetailers, getRetailerById, login, updateRetailerById } from "../controller/RetailerController.js";

const retailerRouter = express.Router();
retailerRouter.post("/create", createRetailer);
retailerRouter.get("/", getAllRetailers);
retailerRouter.get("/findById/:id", getRetailerById);
retailerRouter.put("/updateById/:id", updateRetailerById);
retailerRouter.delete("/deleteById/:email", deleteRetailerById);
retailerRouter.post("/login", login);
retailerRouter.put("/changePassword/:id", changePassword);

export default retailerRouter;