import express from 'express'
import { createItem, deleteItemById, getAllItems, getItemById, getItemsByRetailer, updateItemById } from '../controller/ItemsController.js';

const itemRouter = express.Router();

itemRouter.post("/create", createItem);
itemRouter.get("/", getAllItems);
itemRouter.get("/getItemById/:id", getItemById);
itemRouter.get("/getItemsByRetailer/:retailer", getItemsByRetailer);
itemRouter.put("/updateById/:id", updateItemById);
itemRouter.delete("/deleteById/:id", deleteItemById);

export default itemRouter;