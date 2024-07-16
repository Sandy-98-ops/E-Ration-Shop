import express from 'express'
import { createStock, deleteStockById, getAllStockByRetailer, getAllStocks, getRecentStockByRetailer, getStockById, updateStockById } from '../controller/StockController.js';

const stockRouter = express.Router();

stockRouter.post("/create", createStock);
stockRouter.get("/", getAllStocks);
stockRouter.get("/getItemById/:id", getStockById);
stockRouter.get("/getStockByRetailer/:retailer", getRecentStockByRetailer);
stockRouter.get("/getAllStockByRetailer/:retailer", getAllStockByRetailer);
stockRouter.put("/updateById/:id", updateStockById);
stockRouter.delete("/deleteItemById/:id", deleteStockById);

export default stockRouter;