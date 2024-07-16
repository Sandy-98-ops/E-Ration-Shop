import express from "express"
import { changeDistributorPassword, createDistributor, deleteDistributorById, distributorLogin, forgotPassword, getAllDistributors, getDistributorById, updateDistributorById } from "../controller/DistributorController.js";

const distributorRoute = express.Router();
distributorRoute.post("/create", createDistributor);
distributorRoute.get("/", getAllDistributors);
distributorRoute.get("/findById/:id", getDistributorById)
distributorRoute.put("/updateById/:id", updateDistributorById);
distributorRoute.delete("/deleteById/:id", deleteDistributorById);
distributorRoute.post("/login", distributorLogin);
distributorRoute.put("/changePassword/:id", changeDistributorPassword);
distributorRoute.put("/forgotPassword/:email", forgotPassword);
export default distributorRoute;