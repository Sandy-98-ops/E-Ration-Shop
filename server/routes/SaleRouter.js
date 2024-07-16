import express from 'express'
import { createSale, deleteSaleById, getAllSales, getSaleByCitizen, getSaleById, getSaleByRetailer, updateSaleById } from '../controller/SaleController.js';

const saleRouter = express.Router();

saleRouter.post("/create", createSale);
saleRouter.get("/", getAllSales);
saleRouter.get("/getsaleByRetailer/:retailer", getSaleByRetailer);
saleRouter.get("/getSaleByCitizen/:citizen", getSaleByCitizen);
saleRouter.get("/getItemById/:id", getSaleById);
saleRouter.put("/updateById/:id", updateSaleById);
saleRouter.delete("/deleteItemById/:id", deleteSaleById);

export default saleRouter;