import express from 'express';
import { citizenLogin, create, getCitizenById, getCitizenByRationCarNoAndRetailer, getCitizens, getCitizensByRetailerId } from '../controller/CitizenController.js';

const citizenRoutes = express.Router();

citizenRoutes.post('/create', create);
citizenRoutes.get("/", getCitizens);
citizenRoutes.get("/:id", getCitizenById);
citizenRoutes.post("/login", citizenLogin);
citizenRoutes.get("/getCitizensByRetailerId/:retailer", getCitizensByRetailerId);
citizenRoutes.post("/getCitizensByRationCardNumberAndRetailer", getCitizenByRationCarNoAndRetailer);
export default citizenRoutes;
